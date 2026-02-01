import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor } from '../entities/visitor.entity';
import type { IVisitorHelper, VisitorStatsResult } from '../interface/visitor.helper.interface';
import { RecordVisitorDto } from '../dto/record-visitor.dto';

@Injectable()
export class VisitorHelper implements IVisitorHelper {
  constructor(
    @InjectModel(Visitor.name)
    private readonly visitorModel: Model<Visitor>,
  ) {}

  async create(ip: string, dto: RecordVisitorDto, userAgent?: string): Promise<void> {
    await this.visitorModel.create({
      ip,
      country: dto.country ?? '',
      city: dto.city ?? '',
      region: dto.region ?? '',
      userAgent: userAgent ?? '',
    });
  }

  async getTotalCount(): Promise<number> {
    return this.visitorModel.countDocuments().exec();
  }

  async getStats(): Promise<VisitorStatsResult> {
    const total = await this.visitorModel.countDocuments().exec();

    const byCountry = await this.visitorModel
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: { $ifNull: ['$country', ''] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ])
      .exec();

    const byLocation = await this.visitorModel
      .aggregate<{ _id: { country: string; city: string }; count: number }>([
        {
          $group: {
            _id: {
              country: { $ifNull: ['$country', ''] },
              city: { $ifNull: ['$city', ''] },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 100 },
      ])
      .exec();

    return {
      total,
      byCountry: byCountry.map((x) => ({
        country: x._id && String(x._id).trim() ? x._id : '(Unknown)',
        count: x.count,
      })),
      byLocation: byLocation.map((x) => ({
        country: x._id.country && String(x._id.country).trim() ? x._id.country : '(Unknown)',
        city: x._id.city && String(x._id.city).trim() ? x._id.city : '(Unknown)',
        count: x.count,
      })),
    };
  }
}
