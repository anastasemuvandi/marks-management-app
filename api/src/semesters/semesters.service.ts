import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';

@Injectable()
export class SemestersService {
  constructor(@InjectRepository(Semester) private repo: Repository<Semester>) {}

  findAll() {
    return this.repo.find({ relations: ['academicYear'], order: { academicYearId: 'ASC', number: 'ASC' } });
  }

  findByAcademicYear(academicYearId: string) {
    return this.repo.find({ where: { academicYearId }, order: { number: 'ASC' } });
  }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id }, relations: ['academicYear'] });
    if (!s) throw new NotFoundException('Semester not found');
    return s;
  }

  async create(dto: CreateSemesterDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateSemesterDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
