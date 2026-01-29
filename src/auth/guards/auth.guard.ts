import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import type { IUserHelper } from 'src/user/interface/user.helper.interface';
import type { IAuthHelper } from '../interface/auth.helper.interface';
import mongoose from 'mongoose';

dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    @Inject('IAuthHelper') private readonly authHelper: IAuthHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        throw new UnauthorizedException('Authorization token is missing');
      }

      // Check if this is a refresh token endpoint to prevent infinite loops
      const url = request.url;
      const isRefreshTokenEndpoint = url.includes('/auth/refresh-token');
      
      // Decode token with proper error handling
      let payload;
      try {
        payload = await this.authHelper.decodeToken(String(token));
      } catch (error) {
        // If this is a refresh token endpoint and token is invalid, don't throw
        // Let the refresh token service handle it
        if (isRefreshTokenEndpoint) {
          throw new UnauthorizedException('Invalid refresh token');
        }
        throw new UnauthorizedException('Invalid access token');
      }

      // Find user with proper error handling
      const [user] = await this.userHelper.findUserWithSchema({
        _id: new mongoose.Types.ObjectId(payload.userId),
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check user status
      if (!user.isVerified) {
        throw new UnauthorizedException('User is not verified');
      }
      if (user.isDeleted) {
        throw new UnauthorizedException('User account is deleted');
      }

      // Validate refresh tokens only for non-refresh endpoints
      if (!isRefreshTokenEndpoint) {
        await this.validateRefreshTokens(user, payload);
      }

      // Update user's last activity
      await this.userHelper.updateUser(
        {
          _id: new mongoose.Types.ObjectId(payload.userId),
        },
        {
          updatedAt: new Date(),
        },
      );

      // Attach user data to request
      request['user'] = payload;
      request['fullUser'] = user;
      
      return true;
    } catch (error) {
      // Log the error for debugging
      console.error('AuthGuard error:', error.message);
      
      // Re-throw as UnauthorizedException
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }

  /**
   * Validate that the current access token's uniqueId exists in user's refresh tokens
   */
  private async validateRefreshTokens(user: any, payload: any): Promise<void> {
    const payloadUnique: string[] = [];
    const invalidTokens: string[] = [];

    // Process refresh tokens with proper error handling
    for (const refreshToken of user.refreshToken) {
      try {
        const refreshTokenPayload = await this.authHelper.decodeToken(refreshToken);
        payloadUnique.push(refreshTokenPayload.uniqueId);
      } catch (error) {
        // Mark invalid token for removal
        invalidTokens.push(refreshToken);
      }
    }

    // Remove invalid refresh tokens
    if (invalidTokens.length > 0) {
      await Promise.all(
        invalidTokens.map(token =>
          this.userHelper.removeRefreshToken({
            _id: payload.userId,
            refreshToken: token,
          })
        )
      );
    }

    // Check if current token's uniqueId is valid
    if (!payloadUnique.includes(payload.uniqueId)) {
      throw new UnauthorizedException('Access token is invalid or expired');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
