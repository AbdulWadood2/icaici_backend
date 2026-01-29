
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserDto } from 'src/user/dto/user.dto';

export interface IAuthService {
  loginUser(dto: LoginUserDto): Promise<UserDto>;
  logout(refreshToken: string, fcmToken?: string): Promise<void>;
  refreshToken(
    refreshToken: string,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }>;
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserDto>;
}
