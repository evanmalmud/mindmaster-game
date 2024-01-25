// app/utils/auth.server.ts
import { Authenticator } from 'remix-auth'
import { Auth0Strategy } from 'remix-auth-auth0'
import { sessionStorage } from '~/services/session.server'
import { db as prisma } from './db.server'

// Create an instance of the authenticator, pass a generic (optional) with what your
// strategies will return and will be stored in the session

export const authenticator = new Authenticator(sessionStorage)

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN_URL!
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const email = profile.emails?.[0]?.value!
    // Get the user data from your DB or API using the tokens and profile
    return prisma.user.upsert({
      where: {
        email
      },
      create: {
        email,
        name: profile.displayName!
      },
      update: {}
    })
  }
)

authenticator.use(auth0Strategy)


import { GoogleStrategy } from 'remix-auth-google'

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    const email = profile.emails?.[0]?.value!
    return prisma.user.upsert({
      where: {
        email
      },
      create: {
        email,
        name: profile.displayName!
      },
      update: {}
    })
  }
)

authenticator.use(googleStrategy)
