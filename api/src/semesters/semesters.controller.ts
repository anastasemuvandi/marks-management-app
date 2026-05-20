import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('semesters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('semesters')
export class SemestersController {
  constructor(private readonly service: SemestersService) {}

  @Get()
  @ApiQuery({ name: 'academicYearId', required: false })
  findAll(@Query('academicYearId') academicYearId?: string) {
    return academicYearId
      ? this.service.findByAcademicYear(academicYearId)
      : this.service.findAll();
  }

  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateSemesterDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSemesterDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
