import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  const cookie = await getSession(request.headers.get('cookie'));
  const authEmail = cookie.get('auth:email');
  const authError = cookie.get(authenticator.sessionErrorKey);

  if (!authEmail) return redirect('/login');

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
    successRedirect: currentPath,
    failureRedirect: currentPath,
  });
}

export default function Verify() {
  const { authEmail, authError } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-auto items-center justify-center px-8">
      <div className="mt-12 flex w-full max-w-sm flex-col items-center justify-center gap-6 md:mt-24 md:max-w-md">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Please check your inbox
              </h1>
              <p className="text-center text-base font-normal text-gray-600">
                {`We've sent you a magic link email.`}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Form
              method="POST"
              autoComplete="off"
              className="flex w-full flex-col gap-4"
            >
              <div className="flex flex-col">
                <label htmlFor="code" className="sr-only">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter code..."
                  className="h-11 rounded-md border-2 border-gray-200 bg-transparent px-4 text-base font-semibold placeholder:font-normal placeholder:text-gray-400"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-neutral-600 py-4 text-white"
              >
                Continue
              </Button>
            </Form>

            <Form
              method="POST"
              autoComplete="off"
              className="mt-8 flex w-full flex-col gap-2"
            >
              <Button type="submit" className="w-full bg-gray-200 py-4">
                Request New Code
              </Button>
            </Form>
          </div>
        </div>

        {authEmail && authError && (
          <span className="font-semibold text-red-400">
            {authError?.message}
          </span>
        )}

        <p className="text-center text-xs leading-relaxed text-gray-400">
          By continuing, you agree to our{' '}
          <span className="clickable underline">Terms of Service</span>
        </p>
      </div>
    </main>
  );
}
