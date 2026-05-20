import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './mark.entity';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mark])],
  providers: [MarksService],
  controllers: [MarksController],
  exports: [MarksService],
})
export class MarksModule {}
