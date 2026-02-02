import mongoose from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserSchemaDto } from '../dto/user-schema.dto';

export interface IUserHelper {
  createUserWithSchema(dto: Partial<UserSchemaDto>): Promise<UserSchemaDto>;
  findUser(
    dto: Partial<UserDto>,
  ): Promise<UserDto[]>;
  findUserWithSchema(dto: Partial<UserSchemaDto>): Promise<UserSchemaDto[]>;
  pushRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null>;
  removeRefreshToken(payload: {
    _id: string;
    refreshToken: string;
  }): Promise<User | null>;
  updateUser(
    find: Partial<User>,
    dto: Partial<User>,
  ): Promise<UserDto>;
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    decrypt: (password: string) => string,
    encrypt: (password: string) => string,
  ): Promise<UserDto>;
  findUserById(
    userId: mongoose.Types.ObjectId,
  ): Promise<UserDto | null>;
}
