import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ReviewerApplication extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  affiliation: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  qualification: string;

  @Prop({ required: true })
  keywords: string;

  @Prop({ required: true })
  linkedIn: string;

  @Prop({ required: true })
  paperCapacity: string;

  @Prop({ default: true })
  confidentiality: boolean;
}

export const ReviewerApplicationSchema = SchemaFactory.createForClass(ReviewerApplication);
ReviewerApplicationSchema.index({ email: 1, createdAt: -1 });
