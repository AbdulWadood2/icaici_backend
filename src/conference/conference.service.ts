import { Injectable, Inject } from '@nestjs/common';
import { Conference } from './entities/conference.entity';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import type { IConferenceService } from './interface/conference.service.interface';
import type { IConferenceHelper } from './interface/conference.helper.interface';
import { logAndThrowError } from 'src/utils/error/error.utils';

@Injectable()
export class ConferenceService implements IConferenceService {
  constructor(
    @Inject('IConferenceHelper')
    private readonly conferenceHelper: IConferenceHelper,
  ) {}

  async getSettings(): Promise<Conference> {
    try {
    let conference = await this.conferenceHelper.findOne();

    if (!conference) {
      conference = await this.conferenceHelper.createDefault();
    }

    return conference;
    } catch (error) {
      logAndThrowError(error, 'ConferenceService.getSettings');
      throw error;
    }
  }

  async updateSettings(dto: UpdateConferenceDto): Promise<Conference> {
    try {
      return this.conferenceHelper.findOneAndUpdate(dto);
    } catch (error) {
      logAndThrowError(error, 'ConferenceService.updateSettings');
      throw error;
    }
  }
}
