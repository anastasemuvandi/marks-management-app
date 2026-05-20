import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './create-student.dto';
import { UpdateStudentDto } from './update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }
  @Get(':id/modules') getModules(@Param('id', ParseUUIDPipe) id: string) { return this.service.getModules(id); }
  @Post() create(@Body() dto: CreateStudentDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStudentDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
  @Post(':id/modules/:moduleId') enrollModule(@Param('id', ParseUUIDPipe) id: string, @Param('moduleId', ParseUUIDPipe) moduleId: string) { return this.service.enrollModule(id, moduleId); }
  @Delete(':id/modules/:moduleId') unenrollModule(@Param('id', ParseUUIDPipe) id: string, @Param('moduleId', ParseUUIDPipe) moduleId: string) { return this.service.unenrollModule(id, moduleId); }
}
