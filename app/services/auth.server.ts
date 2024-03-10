// app/utils/auth.server.ts
import type { User } from '@prisma/client';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { GoogleStrategy } from 'remix-auth-google';
import { TOTPStrategy } from 'remix-auth-totp';

import {
  ENCRYPTION_SECRET,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '~/config/env.server';
import { generateFromEmail } from '~/lib/random-username';
import { sessionStorage } from '~/services/session.server';

import { db } from './db.server';
import { sendAuthEmail } from './email.server';

export const authenticator = new Authenticator<User>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN_URL!,
  },
  async ({ profile }) => {
    const email = profile.emails?.[0].value ?? '';

    return db.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        name: profile.displayName!,
      },
      update: {},
    });
  },
);

authenticator.use(auth0Strategy);

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

authenticator.use(
  new TOTPStrategy(
    {
      secret: ENCRYPTION_SECRET,
      sendTOTP: async ({ email, code, magicLink }) => {
        await sendAuthEmail({ email, code, magicLink });
      },
    },
    async ({ email }) => {
      let user = await db.user.findFirst({
        where: { email },
      });

      if (!user) {
        user = await db.user.create({
          data: { email, name: generateFromEmail(email) },
        });
      }

      return user;
    },
  ),
);
