import { model, Schema } from 'mongoose';

import { IAuth } from './auth-type';

// One user can have multiple auth accounts
// For local authentication, provider will be 'local' and providerId will be empty string
const AuthSchema = new Schema<IAuth>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    localPassword: { type: String },
    verifyAt: { type: Date, default: null }
  },
  { timestamps: true }
);

AuthSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const AuthModel = model<IAuth>('Auth', AuthSchema);
export default AuthModel;
