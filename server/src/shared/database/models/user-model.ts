import mongoose, { type PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import type { User } from '~/entities/user';
import { GENDER } from '~/shared/constants/gender';
import { ROLE } from '~/shared/constants/role';

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    gender: { type: String, enum: Object.values(GENDER) },
    role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
      default: ROLE.USER
    },
    dob: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(mongoosePaginate);

export const UserModel = mongoose.model<User, PaginateModel<User>>(
  'User',
  userSchema
);
