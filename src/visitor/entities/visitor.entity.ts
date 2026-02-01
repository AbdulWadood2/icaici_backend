import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Visitor extends Document {
  @Prop({ required: true })
  ip: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  region: string;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ default: Date.now })
  visitedAt: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);

// Index for stats by country and date
VisitorSchema.index({ country: 1, visitedAt: -1 });
VisitorSchema.index({ visitedAt: -1 });
