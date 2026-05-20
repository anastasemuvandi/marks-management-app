import { IsNumber, Min, IsPositive, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMarkDto {
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty()
  @IsUUID()
  moduleId: string;

  @ApiProperty()
  @IsUUID()
  semesterId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  score: number;

  @ApiPropertyOptional({ default: 100 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxScore?: number;
}
