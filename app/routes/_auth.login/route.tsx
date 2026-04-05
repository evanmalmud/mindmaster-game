import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  const cookie = await getSession(request.headers.get('cookie'));
  const authEmail = cookie.get('auth:email');
  const authError = cookie.get(authenticator.sessionErrorKey);

  return json({ authEmail, authError } as const, {
    headers: {
      'set-cookie': await commitSession(cookie),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const currentPath = url.pathname;

  await authenticator.authenticate('TOTP', request, {
    successRedirect: '/verify',
    failureRedirect: currentPath,
  });
}

export default function Login() {
  const { authEmail, authError } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col items-center px-8">
      <Card className="mt-12 w-full max-w-sm md:mt-24 md:max-w-md">
        <CardContent className="flex flex-col gap-4 pt-6">
          <Form
            method="POST"
            autoComplete="off"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex flex-col">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={authEmail ? authEmail : ''}
                placeholder="name@example.com"
                className="h-11 rounded-md border-2 border-gray-200 bg-transparent px-4 text-base font-semibold placeholder:font-normal placeholder:text-gray-400"
                required
              />
            </div>
            <Button className="w-full bg-neutral-600 py-4 text-white">
              Continue with Email
            </Button>
          </Form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Form action="/auth/google" method="post" className="mt-4">
            <Button className="w-full py-4">Login with Google</Button>
          </Form>
        </CardContent>
      </Card>

      {/* Errors Handling. */}
      {!authEmail && authError && (
        <span className="mt-8 font-semibold text-red-400">
          {authError.message}
        </span>
      )}
    </main>
  );
}
