import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './mark.entity';
import { CreateMarkDto } from './create-mark.dto';
import { UpdateMarkDto } from './update-mark.dto';

@Injectable()
export class MarksService {
  constructor(@InjectRepository(Mark) private repo: Repository<Mark>) {}

  findAll() {
    return this.repo.find({ relations: ['student'], order: { createdAt: 'DESC' } });
  }

  findByStudent(studentId: string) {
    return this.repo.find({ where: { studentId }, order: { subject: 'ASC' } });
  }

  async findOne(id: string) {
    const m = await this.repo.findOne({ where: { id }, relations: ['student'] });
    if (!m) throw new NotFoundException(`Mark #${id} not found`);
    return m;
  }

  async create(dto: CreateMarkDto) {
    if (dto.score > (dto.maxScore ?? 100))
      throw new BadRequestException('Score cannot exceed maxScore');
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
    const marks = await this.repo.find({ relations: ['student'] });
    const byStudent: Record<string, { student: any; marks: Mark[] }> = {};

    for (const mark of marks) {
      if (!byStudent[mark.studentId]) {
        byStudent[mark.studentId] = { student: mark.student, marks: [] };
      }
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
        subjectCount: marks.length,
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
