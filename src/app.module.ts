import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { ConferenceModule } from './conference/conference.module';
import { VisitorModule } from './visitor/visitor.module';
import { MailModule } from './mail/mail.module';
import { ReviewerModule } from './reviewers/reviewer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // In Docker, env vars are set by the container; .env is not used.
      ignoreEnvFile: process.env.DOCKER_ENV === '1',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL! as string),
    UserModule,
    AuthModule,
    EncryptionModule,
    ConferenceModule,
    VisitorModule,
    MailModule,
    ReviewerModule,
  ],
})
export class AppModule {}
