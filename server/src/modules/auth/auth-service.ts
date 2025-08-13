import { Document } from 'mongoose';

import AuthModel from '~/modules/auth/auth-model';

import { IUser } from '../user/user-type';

const AuthService = {
  // TODO: When reset password, if user don't have local password, create a new one
  loginWithProvider: async (
    provider: string,
    providerId: string,
    user: Document<unknown, object, IUser> & IUser
  ) => {
    let auth = await AuthModel.findOne({ provider, providerId });

    if (!auth) {
      auth = await AuthModel.create({
        user: user._id,
        provider,
        providerId,
        verifyAt: new Date()
      });
    } else {
      auth.verifyAt = new Date();
      await auth.save();
    }

    return auth;
  }
};

export default AuthService;
