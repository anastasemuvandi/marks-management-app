import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './mark.entity';
import { Student } from '../students/student.entity';
import { CreateMarkDto } from './create-mark.dto';
import { UpdateMarkDto } from './update-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark) private repo: Repository<Mark>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['student', 'module', 'semester', 'semester.academicYear'], order: { createdAt: 'DESC' } });
  }

  findByStudent(studentId: string) {
    return this.repo.find({
      where: { studentId },
      relations: ['module', 'semester', 'semester.academicYear'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const m = await this.repo.findOne({ where: { id }, relations: ['student', 'module', 'semester'] });
    if (!m) throw new NotFoundException(`Mark #${id} not found`);
    return m;
  }

  async create(dto: CreateMarkDto) {
    if (dto.score > (dto.maxScore ?? 100))
      throw new BadRequestException('Score cannot exceed maxScore');

    // verify student is enrolled in the module
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId }, relations: ['modules'] });
    if (!student) throw new NotFoundException('Student not found');
    if (!student.modules.find(m => m.id === dto.moduleId))
      throw new BadRequestException('Student is not enrolled in this module');

    return this.repo.save(this.repo.create({ ...dto, maxScore: dto.maxScore ?? 100 }));
  }

  async update(id: string, dto: UpdateMarkDto) {
    const m = await this.findOne(id);
    Object.assign(m, dto);
    if (m.score > m.maxScore)
      throw new BadRequestException('Score cannot exceed maxScore');
    return this.repo.save(m);
  }

  async remove(id: string) {
    const m = await this.findOne(id);
    return this.repo.remove(m);
  }

  async getGradeSummary() {
    const marks = await this.repo.find({ relations: ['student', 'module', 'semester', 'semester.academicYear'] });
    const byStudent: Record<string, { student: Student; marks: Mark[] }> = {};

    for (const mark of marks) {
      if (!mark.studentId) continue;
      if (!byStudent[mark.studentId])
        byStudent[mark.studentId] = { student: mark.student, marks: [] };
      byStudent[mark.studentId].marks.push(mark);
    }

    return Object.values(byStudent).map(({ student, marks }) => {
      const totalScore = marks.reduce((s, m) => s + m.score, 0);
      const totalMax = marks.reduce((s, m) => s + m.maxScore, 0);
      const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
      return {
        student,
        totalScore,
        totalMax,
        percentage: Math.round(percentage * 100) / 100,
        grade: this.getGrade(percentage),
        moduleCount: marks.length,
        marks,
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }

  private getGrade(pct: number): string {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  }
}
