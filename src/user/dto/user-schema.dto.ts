import { Expose, Transform } from 'class-transformer';
import { UserRole } from '../roles/roles.enum';
import { Types } from 'mongoose';

export class UserSchemaDto {
  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  _id: Types.ObjectId;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  email: string;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  password: string;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  firstName: string;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  verificationToken: string;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  isVerified: boolean;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  refreshToken: string[];

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  role: UserRole;

  @Expose()
  @Transform(({ value }) => (value === undefined ? false : value))
  isDeleted: boolean;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  deletedUserEmail: string;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => (value === undefined ? null : value))
  updatedAt: Date;
}
