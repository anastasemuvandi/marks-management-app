import { Injectable } from '@nestjs/common';
import { MarksService } from '../marks/marks.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportsService {
  constructor(private readonly marksService: MarksService) {}

  async generateExcel(): Promise<Buffer> {
    const summary = await this.marksService.getGradeSummary();

    const rows = summary.flatMap(({ student, marks, percentage, grade }) =>
      marks.map(m => ({
        'Student Name': student?.name ?? '',
        'Student ID': student?.studentId ?? '',
        Group: student?.group ?? '',
        Subject: m.subject,
        Score: m.score,
        'Max Score': m.maxScore,
        Percentage: `${Math.round((m.score / m.maxScore) * 100)}%`,
        'Overall %': `${percentage}%`,
        Grade: grade,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Marks Report');

    const summaryRows = summary.map(({ student, totalScore, totalMax, percentage, grade, subjectCount }) => ({
      'Student Name': student?.name ?? '',
      'Student ID': student?.studentId ?? '',
      Group: student?.group ?? '',
      'Total Score': totalScore,
      'Max Score': totalMax,
      'Percentage': `${percentage}%`,
      Grade: grade,
      Subjects: subjectCount,
    }));
    const ws2 = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

    return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  }

  async generatePdfData() {
    return this.marksService.getGradeSummary();
  }
}
