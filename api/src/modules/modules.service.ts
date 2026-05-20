import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModule } from './module.entity';
import { Student } from '../students/student.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(CourseModule) private repo: Repository<CourseModule>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Module not found');
    return m;
  }

  async create(dto: CreateModuleDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Module name already exists');
    const module = await this.repo.save(this.repo.create(dto));

    // auto-enroll all existing students
    const students = await this.studentRepo.find({ relations: ['modules'] });
    for (const student of students) {
      student.modules = [...(student.modules ?? []), module];
      await this.studentRepo.save(student);
    }
    return module;
  }

  async update(id: string, dto: UpdateModuleDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getEnrolledStudents(moduleId: string) {
    const m = await this.repo.findOne({ where: { id: moduleId }, relations: ['students'] });
    if (!m) throw new NotFoundException('Module not found');
    return m.students;
  }
}
