import {
  Injectable,
  Inject,
} from '@nestjs/common';
import { IUserService } from './interface/user.service.interface';
import { UserDto } from './dto/user.dto';
import type { IUserHelper } from './interface/user.helper.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { logAndThrowError } from 'src/utils/error/error.utils';
import mongoose from 'mongoose';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
  ) {}

  async getProfile(_id: string): Promise<UserDto> {
    try {
      const [user] = await this.userHelper.findUser({ _id });
      return user;
    } catch (error) {
      throw logAndThrowError('error in getProfile', error);
    }
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDto> {
    try {

      const updatedUser = await this.userHelper.updateUser(
        { _id: new mongoose.Types.ObjectId(id) },
        dto,
      )

      return updatedUser;
    } catch (error) {
      throw logAndThrowError('error in updateProfile', error);
    }
  }

  async findUserById(
    userId: mongoose.Types.ObjectId,
  ): Promise<UserDto | null> {
    try {
      return await this.userHelper.findUserById(userId);
    } catch (error) {
      throw logAndThrowError('error in getUserById', error);
    }
  }
}
