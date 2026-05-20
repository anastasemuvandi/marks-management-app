import { IsString, IsNotEmpty, IsDateString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSemesterDto {
  @ApiProperty({ example: 'Semester 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: '1 or 2' })
  @IsInt()
  @Min(1)
  @Max(2)
  @Type(() => Number)
  number: number;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-01-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsUUID()
  academicYearId: string;
}
