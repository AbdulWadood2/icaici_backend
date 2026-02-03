import { Injectable, Inject } from '@nestjs/common';
import { RecordVisitorDto } from './dto/record-visitor.dto';
import type { IVisitorService } from './interface/visitor.service.interface';
import type { IVisitorHelper } from './interface/visitor.helper.interface';
import { logAndThrowError } from 'src/utils/error/error.utils';

async function getGeoByIp(ip: string): Promise<{ country: string; city: string; region: string }> {
  try {
    const isLocalhost = !ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1';
    const url = isLocalhost
      ? 'http://ip-api.com/json/?fields=status,country,city,regionName'
      : `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city,regionName`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const data = (await res.json()) as { status?: string; country?: string; city?: string; regionName?: string };
    if (data?.status === 'success') {
      return {
        country: typeof data.country === 'string' ? data.country : '',
        city: typeof data.city === 'string' ? data.city : '',
        region: typeof data.regionName === 'string' ? data.regionName : '',
      };
    }
  } catch {
    // ignore
  }
  return { country: '', city: '', region: '' };
}

@Injectable()
export class VisitorService implements IVisitorService {
  constructor(
    @Inject('IVisitorHelper')
    private readonly visitorHelper: IVisitorHelper,
  ) {}

  async record(ip: string, dto: RecordVisitorDto, userAgent?: string): Promise<void> {
    try {
      const hasLocation = (dto.country ?? '').trim() || (dto.city ?? '').trim() || (dto.region ?? '').trim();
      let merged: RecordVisitorDto = { ...dto };
      if (!hasLocation) {
        try {
          const geo = await getGeoByIp(ip);
          merged = { ...dto, ...geo };
        } catch {
          // geo fail hone par bhi visitor save karo, location empty
        }
      }
      await this.visitorHelper.create(ip, merged, userAgent);
    } catch (error) {
      logAndThrowError(error, 'VisitorService.record');
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return this.visitorHelper.getTotalCount();
    } catch (error) {
      logAndThrowError(error, 'VisitorService.getTotalCount');
      throw error;
    }
  }

  async getStats() {
    try {
      return this.visitorHelper.getStats();
    } catch (error) {
      logAndThrowError(error, 'VisitorService.getStats');
      throw error;
    }
  }

  async getPublicSummary() {
    try {
      return this.visitorHelper.getPublicSummary();
    } catch (error) {
      logAndThrowError(error, 'VisitorService.getPublicSummary');
      throw error;
    }
  }
}
