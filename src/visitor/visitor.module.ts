import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visitor, VisitorSchema } from './entities/visitor.entity';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { VisitorHelper } from './helper/visitor.helper';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visitor.name, schema: VisitorSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [VisitorController],
  providers: [
    {
      provide: 'IVisitorHelper',
      useClass: VisitorHelper,
    },
    {
      provide: 'IVisitorService',
      useClass: VisitorService,
    },
  ],
  exports: [
    {
      provide: 'IVisitorService',
      useClass: VisitorService,
    },
  ],
})
export class VisitorModule {}
