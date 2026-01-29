import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Email of the user',
    example: 'abdulwadoodowner@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'New password (if changing)',
    minLength: 8,
    example: '12345678',
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    type: String,
    description: 'first Name of user',
    minLength: 8,
    example: 'Abdul Wadood',
    required: true,
  })
  @IsString()
  firstName: string;

  @IsOptional()
  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    type: String,
    description:
      'Referral code of the inviter (8-character uppercase alphanumeric, optional)',
    required: false,
    example: 'ABC12345',
  })
  @IsOptional()
  inviteCode?: string;

  @ApiPropertyOptional({
    description: 'User time zone',
    example: 'Asia/Karachi',
  })
  @IsOptional()
  @IsString()
  userTimeZone?: string;
}
