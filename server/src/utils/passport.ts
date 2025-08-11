import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import AuthModel from '~/modules/auth/auth-model';
import UserModel from '~/modules/user/user-model';

const configurePassport = () => {
  if (process.env.JWT_SECRET) {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
          try {
            const userId =
              jwtPayload.id ||
              jwtPayload._id ||
              jwtPayload.userId ||
              jwtPayload.sub;
            if (!userId) return done(null, false);

            const user = await UserModel.findById(userId);

            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: '/api/auth/facebook/callback',
          profileFields: ['id', 'displayName', 'photos', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = null;
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await UserModel.findOne({ email });
            }
            if (!user) {
              user = await UserModel.create({
                email: email || '',
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value || '',
                role: 'user'
              });
            }

            let auth = await AuthModel.findOne({
              provider: 'facebook',
              providerId: profile.id
            });
            if (!auth) {
              auth = await AuthModel.create({
                user: user._id,
                provider: 'facebook',
                providerId: profile.id,
                verifyAt: new Date()
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Find or create user by email
            let user = null;
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await UserModel.findOne({ email });
            }
            if (!user) {
              user = await UserModel.create({
                email: email || '',
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value || '',
                role: 'user'
              });
            }

            let auth = await AuthModel.findOne({
              provider: 'google',
              providerId: profile.id
            });
            if (!auth) {
              auth = await AuthModel.create({
                user: user._id,
                provider: 'google',
                providerId: profile.id,
                verifyAt: new Date()
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }
};

export default configurePassport;
