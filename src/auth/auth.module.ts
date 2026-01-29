import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { AuthHelper } from './helper/auth.helper';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    forwardRef(() => UserModule),
    EncryptionModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
    AuthGuard,
  ],
  exports: [
    {
      provide: 'IAuthHelper',
      useClass: AuthHelper,
    },
  ],
})
export class AuthModule {}
