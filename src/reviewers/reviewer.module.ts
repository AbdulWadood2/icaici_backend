import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewerApplication, ReviewerApplicationSchema } from './entities/reviewer-application.entity';
import { ReviewerController } from './reviewer.controller';
import { ReviewerService } from './reviewer.service';
import { ReviewerHelper } from './helper/reviewer.helper';
import { ConferenceModule } from 'src/conference/conference.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReviewerApplication.name, schema: ReviewerApplicationSchema },
    ]),
    ConferenceModule,
  ],
  controllers: [ReviewerController],
  providers: [
    {
      provide: 'IReviewerHelper',
      useClass: ReviewerHelper,
    },
    ReviewerService,
  ],
})
export class ReviewerModule {}
