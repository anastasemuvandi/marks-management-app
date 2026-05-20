import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './academic-year.entity';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(@InjectRepository(AcademicYear) private repo: Repository<AcademicYear>) {}

  findAll() {
    return this.repo.find({ relations: ['semesters'], order: { startDate: 'DESC' } });
  }

  async findOne(id: string) {
    const ay = await this.repo.findOne({ where: { id }, relations: ['semesters'] });
    if (!ay) throw new NotFoundException('Academic year not found');
    return ay;
  }

  async create(dto: CreateAcademicYearDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Academic year name already exists');
    if (dto.isActive) await this.repo.update({}, { isActive: false });
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateAcademicYearDto) {
    await this.findOne(id);
    if (dto.isActive) await this.repo.update({}, { isActive: false });
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
