import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Conference, ConferenceSchema } from './entities/conference.entity';
import { ConferenceService } from './conference.service';
import { ConferenceController } from './conference.controller';
import { ConferenceHelper } from './helper/conference.helper';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conference.name, schema: ConferenceSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [ConferenceController],
  providers: [
    {
      provide: 'IConferenceHelper',
      useClass: ConferenceHelper,
    },
    {
      provide: 'IConferenceService',
      useClass: ConferenceService,
    },
  ],
  exports: [
    {
      provide: 'IConferenceService',
      useClass: ConferenceService,
    },
  ],
})
export class ConferenceModule {}
