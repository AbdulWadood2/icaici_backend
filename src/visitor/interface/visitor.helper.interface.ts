import { RecordVisitorDto } from '../dto/record-visitor.dto';

export interface VisitorStatsResult {
  total: number;
  byCountry: Array<{ country: string; count: number }>;
  byLocation: Array<{ country: string; city: string; count: number }>;
}

export interface IVisitorHelper {
  create(ip: string, dto: RecordVisitorDto, userAgent?: string): Promise<void>;

  getTotalCount(): Promise<number>;

  getStats(): Promise<VisitorStatsResult>;
}
