import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './mark.entity';
import { Student } from '../students/student.entity';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, Student])],
  providers: [MarksService],
  controllers: [MarksController],
  exports: [MarksService],
})
export class MarksModule {}
