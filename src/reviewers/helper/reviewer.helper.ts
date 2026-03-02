import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewerApplication } from '../entities/reviewer-application.entity';

@Injectable()
export class ReviewerHelper {
  constructor(
    @InjectModel(ReviewerApplication.name)
    private readonly model: Model<ReviewerApplication>,
  ) {}

  async create(data: Partial<ReviewerApplication>): Promise<ReviewerApplication> {
    const doc = await this.model.create([data]);
    return doc[0]?.toObject?.() ?? doc[0];
  }
}
