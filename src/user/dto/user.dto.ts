import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole } from '../roles/roles.enum';

export class UserDto {
  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : String(value),
  ) // Ensure _id is transformed to a string or empty string
  _id: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  verificationToken: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? false : value,
  )
  isVerified: boolean;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? false : value,
  )
  isDeleted: boolean;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  deletedUserEmail: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) =>
    Array.isArray(obj.refreshToken) ? undefined : obj.refreshToken,
  )
  refreshToken: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  accessToken: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  firstName: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  role: UserRole;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  createdAt: string;

  @Expose()
  @Transform(({ value }) =>
    value === undefined || value === null ? null : value,
  )
  updatedAt: string;
}
