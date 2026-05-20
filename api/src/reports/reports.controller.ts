import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('excel')
  async downloadExcel(@Res() res: Response) {
    const buffer = await this.service.generateExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="marks-report.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('summary')
  async getSummary() {
    return this.service.generatePdfData();
  }
}
