import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../roles/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({ type: String, default: null })
  password: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, default: null })
  verificationToken: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, default: null })
  deletedUserEmail: string;

  @Prop({ type: [{ type: String }] })
  refreshToken: string[];

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @Prop({ type: Date, default: null })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
