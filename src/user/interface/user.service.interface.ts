import { UserDto } from '../dto/user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import mongoose from 'mongoose';

export interface IUserService {
  getProfile(_id: string): Promise<UserDto>;
  updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDto>;
  findUserById(
    userId: mongoose.Types.ObjectId,
  ): Promise<UserDto | null>;
}
