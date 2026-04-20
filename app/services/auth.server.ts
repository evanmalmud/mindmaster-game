import type { User } from '@prisma/client';
import { Authenticator } from 'remix-auth';
import { GoogleStrategy } from 'remix-auth-google';

import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '~/config/env.server';
import { sessionStorage } from '~/services/session.server';

import { db } from './db.server';

export const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
  },
  async ({ profile }) => {
    const email = profile.emails[0].value;

    return db.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        name: profile.displayName,
      },
      update: {
        email,
        name: profile.displayName,
      },
    });
  },
);

authenticator.use(googleStrategy);
