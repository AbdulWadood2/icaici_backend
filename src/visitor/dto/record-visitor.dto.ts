import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RecordVisitorDto {
  @ApiPropertyOptional({ description: 'Country (from client geo if available)' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'City (from client geo if available)' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Region/state' })
  @IsOptional()
  @IsString()
  region?: string;
}
