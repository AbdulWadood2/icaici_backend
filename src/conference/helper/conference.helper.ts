import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conference } from '../entities/conference.entity';
import { IConferenceHelper } from '../interface/conference.helper.interface';
import { UpdateConferenceDto } from '../dto/update-conference.dto';

const DEFAULT_CONFERENCE = {
  conferenceEmail: 'committee@icaici.com',
  fullName: 'International Conference on AI and Computing Innovation',
  shortName: 'ICAICI 2026',
  city: 'Kuala Lumpur',
  country: 'Malaysia',
  location: '',
  about: '',
  tracks: [],
  fees: [],
  venue: '',
  importantDates: [],
  committee: [],
  tpcList: [],
  logo: '/assets/img/logo.png',
  backgroundImage: '',
  timezone: 'GMT +8 (Kuala Lumpur)',
  countdownTargetDate: '2026-05-09T01:00:00.000Z',
  aboutScope: '',
  aboutFormat: '',
  aboutOrganizers: '',
  submissionLink: 'https://easychair.org/conferences/?conf=icaici2026',
  submissionLinkLabel: 'Easy Chair',
  siteTitle: 'ICAICI 2026',
  favicon: '/favicon.ico',
  submissionPortalStatus: 'open',
  conferenceMode: 'hybrid',
  pageContent: new Map(),
  announcements: [],
};

@Injectable()
export class ConferenceHelper implements IConferenceHelper {
  constructor(
    @InjectModel(Conference.name)
    private readonly conferenceModel: Model<Conference>,
  ) {}

  async findOne(): Promise<Conference | null> {
    const doc = await this.conferenceModel.findOne().lean().exec();
    return doc as Conference | null;
  }

  async createDefault(): Promise<Conference> {
    const [created] = await this.conferenceModel.create([DEFAULT_CONFERENCE]);
    return (created?.toObject?.() ?? created) as Conference;
  }

  async findOneAndUpdate(dto: UpdateConferenceDto): Promise<Conference> {
    const updated = await this.conferenceModel
      .findOneAndUpdate(
        {},
        { $set: dto },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean()
      .exec();
    return updated as Conference;
  }
}
