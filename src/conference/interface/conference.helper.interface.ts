import { Conference } from '../entities/conference.entity';
import { UpdateConferenceDto } from '../dto/update-conference.dto';

export interface IConferenceHelper {
  findOne(): Promise<Conference | null>;

  createDefault(): Promise<Conference>;

  findOneAndUpdate(dto: UpdateConferenceDto): Promise<Conference>;
}
