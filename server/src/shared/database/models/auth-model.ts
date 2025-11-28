import mongoose, { Schema, Types } from 'mongoose';

import type { Auth } from '~/entities/auth';

// Omit is used to create a new type by excluding the 'user' field from Auth
// Omit the 'user' field from Auth and replace it with ObjectId
interface AuthDocument extends Omit<Auth, 'user'> {
  user: Types.ObjectId;
}

const authSchema = new Schema<AuthDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    localPassword: { type: String },
    verifyAt: { type: Date, required: true },
    lastResetPasswordToken: { type: String }
  },
  {
    timestamps: true
  }
);

authSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const AuthModel = mongoose.model<AuthDocument>('Auth', authSchema);
