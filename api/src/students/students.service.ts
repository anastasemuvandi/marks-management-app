import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CourseModule } from '../modules/module.entity';
import { CreateStudentDto } from './create-student.dto';
import { UpdateStudentDto } from './update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private repo: Repository<Student>,
    @InjectRepository(CourseModule) private moduleRepo: Repository<CourseModule>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['marks', 'class', 'modules'], order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id }, relations: ['marks', 'class', 'modules'] });
    if (!s) throw new NotFoundException(`Student #${id} not found`);
    return s;
  }

  async create(dto: CreateStudentDto) {
    const exists = await this.repo.findOne({ where: { studentId: dto.studentId } });
    if (exists) throw new ConflictException(`Student ID "${dto.studentId}" already exists`);
    const student = this.repo.create(dto);
    // auto-enroll in all existing modules
    student.modules = await this.moduleRepo.find();
    return this.repo.save(student);
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

  async getModules(studentId: string) {
    const s = await this.repo.findOne({ where: { id: studentId }, relations: ['modules'] });
    if (!s) throw new NotFoundException('Student not found');
    return s.modules;
  }

  async enrollModule(studentId: string, moduleId: string) {
    const s = await this.repo.findOne({ where: { id: studentId }, relations: ['modules'] });
    if (!s) throw new NotFoundException('Student not found');
    const m = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!m) throw new NotFoundException('Module not found');
    if (!s.modules.find(mod => mod.id === moduleId)) {
      s.modules.push(m);
      await this.repo.save(s);
    }
    return s.modules;
  }

  async unenrollModule(studentId: string, moduleId: string) {
    const s = await this.repo.findOne({ where: { id: studentId }, relations: ['modules'] });
    if (!s) throw new NotFoundException('Student not found');
    s.modules = s.modules.filter(m => m.id !== moduleId);
    await this.repo.save(s);
    return s.modules;
  }
}
