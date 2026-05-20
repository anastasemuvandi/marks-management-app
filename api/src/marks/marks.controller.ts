import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './create-mark.dto';
import { UpdateMarkDto } from './update-mark.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('marks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marks')
export class MarksController {
  constructor(private readonly service: MarksService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get('summary') getSummary() { return this.service.getGradeSummary(); }
  @Get('student/:studentId') findByStudent(@Param('studentId', ParseUUIDPipe) id: string) { return this.service.findByStudent(id); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateMarkDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMarkDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
