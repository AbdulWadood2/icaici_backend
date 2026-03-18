import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conference } from '../entities/conference.entity';
import { IConferenceHelper } from '../interface/conference.helper.interface';
import { UpdateConferenceDto } from '../dto/update-conference.dto';

const DEFAULT_CONFERENCE = {
  conferenceEmail: 'committee@example.com',
  fullName: 'International Conference',
  shortName: 'Conference 2026',
  city: 'TBA',
  country: 'TBA',
  location: 'TBA',
  about: '',
  tracks: [],
  fees: [],
  venue: 'TBA',
  importantDates: [],
  committee: [],
  tpcList: [],
  logo: '/assets/img/logo.png',
  backgroundImage: '',
  timezone: 'GMT',
  countdownTargetDate: new Date().toISOString(),
  aboutScope: '',
  aboutFormat: '',
  aboutOrganizers: '',
  submissionLink: '',
  submissionLinkLabel: 'Submission Portal',
  siteTitle: 'Conference 2026',
  favicon: '/favicon.ico',
  submissionPortalStatus: 'open',
  conferenceMode: 'hybrid',
  theme: 'light',
  primaryColor: '#1e293b',
  pagePaddingVertical: '38',
  pagePaddingHorizontal: '16',
  pageOrder: [
    'home',
    'about',
    'cfp',
    'committee',
    'dates',
    'venue',
    'policy',
    'registration',
    'publications',
    'quicklinks_announcements',
    'submission',
    'contact',
    'reviewers',
  ],
  pageContent: new Map(),
  venueOnlinePlatformText: 'TBA',
  venueHotelsText: 'TBA',
  policyContent: '',
  registrationContent: '',
  registrationWhatIsIncluded: '',
  registrationHowToRegister: '',
  submissionDescription: '',
  cfpIntro: '',
  cfpGuidelines: '',
  homePublicationText: '',
  homeQuickLinks: [],
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
