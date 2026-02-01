import { RecordVisitorDto } from '../dto/record-visitor.dto';
import type { VisitorStatsResult } from './visitor.helper.interface';

export interface IVisitorService {
  record(ip: string, dto: RecordVisitorDto, userAgent?: string): Promise<void>;

  getTotalCount(): Promise<number>;

  getStats(): Promise<VisitorStatsResult>;
}
