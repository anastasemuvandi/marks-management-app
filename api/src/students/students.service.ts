import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './create-student.dto';
import { UpdateStudentDto } from './update-student.dto';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}

  findAll() {
    return this.repo.find({ relations: ['marks'], order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id }, relations: ['marks'] });
    if (!s) throw new NotFoundException(`Student #${id} not found`);
    return s;
  }

  async create(dto: CreateStudentDto) {
    const exists = await this.repo.findOne({ where: { studentId: dto.studentId } });
    if (exists) throw new ConflictException(`Student ID "${dto.studentId}" already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateStudentDto) {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: string) {
    const s = await this.findOne(id);
    return this.repo.remove(s);
  }
}
