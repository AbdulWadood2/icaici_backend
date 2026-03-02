import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, IsUrl, IsIn, MinLength } from 'class-validator';

export class ApplyReviewerDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(1, { message: 'Full name is required' })
  fullName: string;

  @ApiProperty({ example: 'jane@university.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'University of Example' })
  @IsString()
  @MinLength(1, { message: 'Affiliation is required' })
  affiliation: string;

  @ApiProperty({ example: 'Malaysia' })
  @IsString()
  @MinLength(1, { message: 'Country is required' })
  country: string;

  @ApiProperty({ example: 'PhD', enum: ['Master', 'PhD'] })
  @IsIn(['Master', 'PhD'])
  qualification: string;

  @ApiProperty({ example: 'machine learning, IoT, cybersecurity' })
  @IsString()
  @MinLength(1, { message: 'Expertise keywords are required' })
  keywords: string;

  @ApiProperty({ example: 'https://www.linkedin.com/in/janedoe' })
  @IsUrl()
  linkedIn: string;

  @ApiProperty({ example: '2-3', enum: ['2-3', '4-6', '6-8'] })
  @IsIn(['2-3', '4-6', '6-8'])
  paperCapacity: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  confidentiality: boolean;
}
