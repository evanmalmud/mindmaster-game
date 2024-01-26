# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

App Starts on `http://localhost:3000/`

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Fly.io

Using fly.io for deploys - https://fly.io/docs/apps/deploy/

```sh
fly deploy
```

Edit the fly.toml file to make changes to the setup.

## DB - Using Fly Postgres

Proxy DB from flyway to local:5432

```sh
fly proxy 5432 -a plot-points-db
```

## DB - Prisma

To create a new migration run

```sh
npm run db:migrate  -- <migration_name>
```

## Google Auth

https://console.cloud.google.com/apis/credentials?project=plotpoints

## Resouces Used

https://github.com/ShubhamVerma1811/remix-prisma-auth0-starter
https://shubhamverma.me/blog/authentication-and-protected-routes-with-remix-auth-0-and-prisma

https://devtools.tech/blog/add-social-authentication-to-remix-run-project-or-express-server---rid---jVwo6agJvN2oX4IegYgz
https://github.com/TheRealFlyingCoder/remix-auth-socials
https://github.com/pbteja1998/remix-auth-google
