import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcademicYearDto {
  @ApiProperty({ example: '2024-2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2024-09-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-30' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
