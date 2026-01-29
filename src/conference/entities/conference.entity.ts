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

  @Prop()
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

  @Prop({ default: '' })
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

  @Prop({ default: '' })
  location: string;

  @Prop({ default: '' })
  about: string;

  @Prop({ type: [Object], default: [] })
  tracks: TrackItem[];

  @Prop({ type: [Object], default: [] })
  fees: FeeItem[];

  @Prop({ default: '' })
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
}

export const ConferenceSchema = SchemaFactory.createForClass(Conference);
