import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'The token of the user',
    example: 'dfhjkldsdfhjil;kojhdfhgjhk;kjhgch',
  })
  @IsNotEmpty({ message: 'token is required' })
  refreshToken: string;

  //  optional fcm_key
  @ApiPropertyOptional({
    description: 'The fcm key of the user',
    example: 'dfhjkldsdfhjil;kojhdfhgjhk;kjhgch',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
