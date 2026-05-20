import { IsString, IsNotEmpty, IsNumber, Min, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMarkDto {
  @ApiProperty({ description: 'UUID of the student' })
  @IsUUID()
  studentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  score: number;

  @ApiPropertyOptional({ default: 100 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxScore?: number;
}
