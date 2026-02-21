import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { IAuthService } from './interface/auth.service.interface';
import type { IUserHelper } from 'src/user/interface/user.helper.interface';
import { UserDto } from 'src/user/dto/user.dto';
import type { IEncryptionService } from 'src/encryption/interface/encryption.interface.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { plainToInstance } from 'class-transformer';
import type { IAuthHelper } from './interface/auth.helper.interface';
import mongoose from 'mongoose';
import { logAndThrowError } from 'src/utils/error/error.utils';
import { UserRole } from 'src/user/roles/roles.enum';

@Injectable()
export class AuthService implements IAuthService{ 
  constructor(
    @Inject('IAuthHelper') private readonly authHelper: IAuthHelper,
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    @Inject('IEncryptionService')
    private readonly encryptionService: IEncryptionService,
  ) {}

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserDto> {
    try {
      let updatedUser = await this.userHelper.changePassword(
        userId,
        oldPassword,
        newPassword,
        this.encryptionService.decrypt.bind(this.encryptionService),
        this.encryptionService.encrypt.bind(this.encryptionService),
      );
      return updatedUser;
    } catch (error) {
      throw logAndThrowError('error in changePassword', error);
    }
  }

  async loginUser(dto: LoginUserDto): Promise<UserDto> {
    try {
      let [userExist] = await this.userHelper.findUserWithSchema({
        email: dto.email,
        role: UserRole.ADMIN,
      });
      if (!userExist) {
        //  at least one admin should exist
        let [adminUser] = await this.userHelper.findUserWithSchema({
          role: UserRole.ADMIN,
        });
        if (adminUser) {
          throw new BadRequestException('invalid email or password');
        }
        if(dto.email !== process.env.ADMIN_INITIAL_EMAIL || dto.password !== process.env.ADMIN_INITIAL_PASSWORD) {
          throw new BadRequestException('wrong email or password');
        }
        const adminEmail =
          process.env.ADMIN_INITIAL_EMAIL || 'admin@gmail.com';
        const adminPassword =
          process.env.ADMIN_INITIAL_PASSWORD || 'verystrongpassword';
        userExist = await this.userHelper.createUserWithSchema({
          email: adminEmail,
          password: this.encryptionService.encrypt(adminPassword),
          role: UserRole.ADMIN,
          firstName: 'Admin',
          isVerified: true,
          isDeleted: false,
        });
      }
      if (!userExist.isVerified) {
        throw new BadRequestException('user is not verified');
      }
      if (userExist.isDeleted) {
        throw new BadRequestException('user is deleted');
      }
      if (!userExist.password) {
        throw new BadRequestException(
          'please reset your password for manual login',
        );
      }
      if (this.encryptionService.decrypt(userExist.password) !== dto.password) {
        throw new BadRequestException('password is incorrect');
      }
      const { refreshToken, accessToken } =
        await this.authHelper.generateTokens({
          userId: userExist._id.toString(),
          role: userExist.role,
          email: userExist.email,
        });
      await this.userHelper.pushRefreshToken({
        _id: userExist._id.toString(),
        refreshToken,
      });
      const [dtoUser] = await this.userHelper.findUser(
        {
          email: userExist.email,
        },
      );
      const userDtoUser = plainToInstance(UserDto, {
        ...dtoUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return userDtoUser;
    } catch (error) {
      throw logAndThrowError('error in loginUser', error);
    }
  }

  async logout(refreshToken: string, fcmToken?: string): Promise<void> {
    try {
      const decoded = await this.authHelper.decodeToken(refreshToken);

      // Find the user with the decoded userId
      const [user] = await this.userHelper.findUserWithSchema({
        _id: new mongoose.Types.ObjectId(decoded.userId),
      });
      if (!user || !user.refreshToken.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.userHelper.removeRefreshToken({
        _id: String(user._id),
        refreshToken,
      });

      return;
    } catch (error) {
      throw logAndThrowError('error in logout', error);
    }
  }

  // refreshToken
  async refreshToken(
    refreshToken: string,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    try {
      // Validate refresh token format
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new UnauthorizedException('Invalid refresh token format');
      }

      // Decode refresh token
      let decoded;
      try {
        decoded = await this.authHelper.decodeToken(refreshToken);
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Find user
      const [user] = await this.userHelper.findUserWithSchema({
        _id: new mongoose.Types.ObjectId(decoded.userId),
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if user is active
      if (!user.isVerified) {
        throw new UnauthorizedException('User is not verified');
      }
      if (user.isDeleted) {
        throw new UnauthorizedException('User account is deleted');
      }

      // Validate that the refresh token exists in user's refresh tokens
      if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userId = user._id.toString();

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authHelper.generateTokens({
          userId,
          role: user.role,
          email: user.email,
        });

      // Remove old refresh token and add new one atomically
      await Promise.all([
        this.userHelper.removeRefreshToken({ _id: userId, refreshToken }),
        this.userHelper.pushRefreshToken({
          _id: userId,
          refreshToken: newRefreshToken,
        }),
      ]);

      // Log successful refresh for monitoring
      console.log(`Refresh token renewed for user: ${userId}`);

      return { data: { accessToken, refreshToken: newRefreshToken } };
    } catch (error) {
      // Log the error for debugging
      console.error('Refresh token error:', error.message);

      // Re-throw the error
      throw error;
    }
  }
}
