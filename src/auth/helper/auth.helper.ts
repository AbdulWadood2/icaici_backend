import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import * as crypto from 'crypto';
import type { IAuthHelper } from '../interface/auth.helper.interface';
import { UserRole } from 'src/user/roles/roles.enum';
import { DecodedJwtToken } from '../dto/decodedToken.dto';
import type { IEncryptionService } from 'src/encryption/interface/encryption.interface.service';

@Injectable()
export class AuthHelper implements IAuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IEncryptionService')
    private readonly encryptionService: IEncryptionService,
  ) {}

  // Generate Unique Id
  generateUniqueId(namespace: string): string {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomString = crypto.randomBytes(16).toString('hex'); // Generate a random string
    return `${namespace}-${timestamp}-${randomString}`;
  }

  // Generate Token
  async generateTokens(payload: {
    userId: string;
    role: UserRole;
    email: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // generate otp
    const uniqueId = this.generateUniqueId('default');
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      uniqueId,
    };
    const accessOptions: JwtSignOptions = {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_AccessTokenExpiry ?? '1h') as JwtSignOptions['expiresIn'],
    };
    const refreshOptions: JwtSignOptions = {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_RefreshTokenExpiry ?? '7d') as JwtSignOptions['expiresIn'],
    };
    const accessToken = this.jwtService.sign(tokenPayload, accessOptions);
    const refreshToken = this.jwtService.sign(tokenPayload, refreshOptions);

    return { accessToken, refreshToken };
  }

  // Decode Token
  async decodeToken(token: string): Promise<DecodedJwtToken> {
    return this.jwtService.verify(token);
  }

  // Method to validate password on login
  validatePassword(plainPassword: string, storedPassword: string): boolean {
    const decryptedPassword = this.encryptionService.decrypt(storedPassword);
    return plainPassword === decryptedPassword;
  }

  // Generate OTP
  generateOtp(): number {
    const digits = 6;
    if (digits <= 0) {
      throw new Error('Number of digits must be greater than 0');
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  }
}
