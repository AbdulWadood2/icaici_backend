import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class TrackItem {
  @Prop()
  title: string;

  @Prop([String])
  items: string[];
}

export class ImportantDateItem {
  @Prop()
  label: string;

  @Prop({ default: 'TBA' })
  date: string;
}

export class FeeItem {
  @Prop()
  description: string;

  @Prop()
  amount: string;
}

export class CommitteeMember {
  @Prop()
  role: string;

  @Prop({ default: 'TBA' })
  name: string;
}

@Schema({ timestamps: true, _id: true })
export class Conference extends Document {
  @Prop({ default: 'committee@icaici.com' })
  conferenceEmail: string;

  @Prop({ default: 'International Conference on AI and Computing Innovation' })
  fullName: string;

  @Prop({ default: 'ICAICI 2026' })
  shortName: string;

  @Prop({ default: 'Kuala Lumpur' })
  city: string;

  @Prop({ default: 'Malaysia' })
  country: string;

  @Prop({ default: 'TBA' })
  location: string;

  @Prop({ default: '' })
  about: string;

  @Prop({ type: [Object], default: [] })
  tracks: TrackItem[];

  @Prop({ type: [Object], default: [] })
  fees: FeeItem[];

  @Prop({ default: 'TBA' })
  venue: string;

  @Prop({ type: [Object], default: [] })
  importantDates: ImportantDateItem[];

  @Prop({ type: [Object], default: [] })
  committee: CommitteeMember[];

  @Prop({ default: '' })
  tpcList: string[];

  @Prop({ default: '/assets/img/logo.png' })
  logo: string;

  @Prop({ default: '' })
  backgroundImage: string;

  @Prop({ default: 'GMT +8 (Kuala Lumpur)' })
  timezone: string;

  @Prop({ default: '2026-05-09T01:00:00.000Z' })
  countdownTargetDate: string;

  @Prop({ default: '' })
  aboutScope: string;

  @Prop({ default: '' })
  aboutFormat: string;

  @Prop({ default: '' })
  aboutOrganizers: string;

  @Prop({ default: 'https://easychair.org/conferences/?conf=icaici2026' })
  submissionLink: string;

  @Prop({ default: 'Easy Chair' })
  submissionLinkLabel: string;

  // Browser tab and branding
  @Prop({ default: 'ICAICI 2026' })
  siteTitle: string;

  @Prop({ default: '/favicon.ico' })
  favicon: string;

  // Submission portal: 'open' | 'closed'
  @Prop({ default: 'open' })
  submissionPortalStatus: string;

  // Conference mode: 'hybrid' | 'online' | 'onsite'
  @Prop({ default: 'hybrid' })
  conferenceMode: string;

  // Page content (key = page slug, value = HTML or markdown)
  @Prop({ type: Map, of: String, default: () => new Map() })
  pageContent: Map<string, string>;

  // Venue section (when not using pageContent)
  @Prop({ default: 'TBA' })
  venueOnlinePlatformText: string;

  @Prop({ default: 'TBA' })
  venueHotelsText: string;

  // Policy section (HTML; when empty, show TBA)
  @Prop({ default: '' })
  policyContent: string;

  // Registration section (when not using pageContent)
  @Prop({ default: '' })
  registrationContent: string;

  @Prop({ default: '' })
  registrationWhatIsIncluded: string;

  @Prop({ default: '' })
  registrationHowToRegister: string;

  // Submission section
  @Prop({ default: '' })
  submissionDescription: string;

  // CFP section
  @Prop({ default: '' })
  cfpIntro: string;

  @Prop({ default: '' })
  cfpGuidelines: string;

  // Home section (when not using pageContent)
  @Prop({ default: '' })
  homePublicationText: string;

  @Prop({
    type: [{ label: String, href: String }],
    default: [],
  })
  homeQuickLinks: Array<{ label: string; href: string }>;

  // Theme & color (admin configurable)
  @Prop({ default: 'light' })
  theme: string;

  @Prop({ default: '#1e293b' })
  primaryColor: string;

  // Page padding (px values as string, e.g. "38" "16")
  @Prop({ default: '38' })
  pagePaddingVertical: string;

  @Prop({ default: '16' })
  pagePaddingHorizontal: string;

  // Page order (slug array; determines nav + section order)
  @Prop({ type: [String], default: [] })
  pageOrder: string[];

  // Announcements (title, content, optional date, active)
  @Prop({
    type: [
      {
        title: String,
        content: String,
        date: { type: Date, required: false },
        active: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  announcements: Array<{
    title: string;
    content: string;
    date?: Date;
    active?: boolean;
  }>;
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);
