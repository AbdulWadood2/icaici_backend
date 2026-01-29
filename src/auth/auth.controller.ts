import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { IAuthService } from './interface/auth.service.interface';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/user/roles/roles.enum';
import { LogoutDto } from './dto/logout-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @ApiOperation({ summary: 'login user' })
  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<{ data: UserDto }> {
    const response = await this.authService.loginUser(dto);
    return { data: response };
  }

  @ApiOperation({ summary: 'Logout user by invalidating refresh token' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<{ data: string }> {
    await this.authService.logout(logoutDto.refreshToken, logoutDto.fcmToken);
    return { data: 'logout successfully' };
  }

  @ApiOperation({ summary: 'Refresh the access token using the refresh token' })
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @Post('refresh-token')
  async refreshToken(
    @Req() request: any,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    // Get the token from the Authorization header
    const token = request.headers['authorization']?.split(' ')[1];

    // Pass the token to the authService for validation and refresh
    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    return this.authService.refreshToken(token); // Call the service with the token
  }
}
