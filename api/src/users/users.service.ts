import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.repo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password: _, ...u }) => u as Omit<User, 'password'>);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const exists = await this.repo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) throw new ConflictException('Username or email already taken');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ ...dto, password: hashed });
    const saved = await this.repo.save(user);
    const { password: _, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      dto = { ...dto, password: await bcrypt.hash(dto.password, 10) };
    }
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.delete(id);
  }

  async seedAdmin(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) return;
    const hashed = await bcrypt.hash('admin123', 10);
    await this.repo.save(
      this.repo.create({
        username: 'admin',
        email: 'admin@marksmanager.local',
        password: hashed,
        role: UserRole.ADMIN,
      }),
    );
    console.log('Default admin created: username=admin password=admin123');
  }
}
