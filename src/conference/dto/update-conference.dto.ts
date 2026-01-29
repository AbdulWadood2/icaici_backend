import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class TrackItemDto {
  @ApiPropertyOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class ImportantDateItemDto {
  @ApiPropertyOptional()
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  date: string;
}

export class FeeItemDto {
  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  amount: string;
}

export class CommitteeMemberDto {
  @ApiPropertyOptional()
  @IsString()
  role: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateConferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conferenceEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ type: [TrackItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackItemDto)
  tracks?: TrackItemDto[];

  @ApiPropertyOptional({ type: [FeeItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeItemDto)
  fees?: FeeItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional({ type: [ImportantDateItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportantDateItemDto)
  importantDates?: ImportantDateItemDto[];

  @ApiPropertyOptional({ type: [CommitteeMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommitteeMemberDto)
  committee?: CommitteeMemberDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tpcList?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  countdownTargetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutScope?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutFormat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutOrganizers?: string;
}
