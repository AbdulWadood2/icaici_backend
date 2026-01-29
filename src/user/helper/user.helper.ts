import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { IUserHelper } from '../interface/user.helper.interface';
import mongoose, { Model } from 'mongoose';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserSchemaDto } from '../dto/user-schema.dto';

@Injectable()
export class UserHelper implements IUserHelper {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // create user
  async createUser(dto: CreateUserDto): Promise<UserDto> {
    // Ensure isDeleted is always false on sign up
    const user = await this.userModel.create({ ...dto, isDeleted: false });
    return plainToInstance(UserDto, user.toObject());
  }

  // find multiple users with schema
  async findUser(
    dto: Partial<UserDto>,
  ): Promise<UserDto[]> {
    let users: User[] = await this.userModel.find(dto).exec();
    return users.map((item) => {
      return plainToInstance(UserDto, item);
    });
  }

  // find multiple users with schema
  async findUserWithSchema(
    dto: Partial<UserSchemaDto>,
  ): Promise<UserSchemaDto[]> {
    const users = await this.userModel.find({
      ...dto,
      $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
    });
    return users.map((item) => {
      return plainToInstance(UserSchemaDto, item.toObject());
    });
  }

  // Push Refresh Token
  async pushRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: payload._id },
      { $push: { refreshToken: payload.refreshToken } },
      { new: true },
    );
    return updatedUser;
  }

  // Remove Refresh Token
  async removeRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: payload._id },
      { $pull: { refreshToken: payload.refreshToken } },
      { new: true },
    );
    return updatedUser;
  }

  // update user
  async updateUser(
    find: Partial<User>,
    dto: Partial<User>,
  ): Promise<UserDto> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: find._id },
      { $set: dto },
      { new: true },
    );
    return plainToInstance(UserDto, updatedUser);
  }

  // change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    decrypt: (password: string) => string,
    encrypt: (password: string) => string,
  ): Promise<UserDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== oldPassword) {
      throw new Error('Old password does not match');
    }
    user.password = encrypt(newPassword);
    await user.save();
    return plainToInstance(UserDto, user);
  }

  // find user by id
  async findUserById(
    userId: mongoose.Types.ObjectId,
  ): Promise<UserDto | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return plainToInstance(UserDto, user);
  }
}
