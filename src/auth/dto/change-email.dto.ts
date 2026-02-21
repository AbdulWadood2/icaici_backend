import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ description: 'Current password (for verification)' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'New email address' })
  @IsEmail()
  newEmail: string;
}
