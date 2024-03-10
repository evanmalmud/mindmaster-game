// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node';

import { NODE_ENV, SESSION_SECRET } from '~/config/env.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [SESSION_SECRET],
    secure: NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
