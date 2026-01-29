import { Conference } from '../entities/conference.entity';
import { UpdateConferenceDto } from '../dto/update-conference.dto';

export interface IConferenceService {
  getSettings(): Promise<Conference>;

  updateSettings(dto: UpdateConferenceDto): Promise<Conference>;
}
