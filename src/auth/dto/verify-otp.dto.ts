import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address associated with the account',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'One-Time Password sent to the user’s email',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
