import type { LoaderFunctionArgs } from '@remix-run/node';
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
  const authError = cookie.get(authenticator.sessionErrorKey);

  return json({ authError } as const, {
    headers: {
      'set-cookie': await commitSession(cookie),
    },
  });
}

export default function Login() {
  const { authError } = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col items-center px-8">
      <Card className="mt-12 w-full max-w-sm md:mt-24 md:max-w-md">
        <CardContent className="flex flex-col gap-4 pt-6">
          <Form action="/api/auth/google" method="post">
            <Button className="w-full py-4">Login with Google</Button>
          </Form>
        </CardContent>
      </Card>

      {authError && (
        <span className="mt-8 font-semibold text-red-400">
          {authError.message}
        </span>
      )}
    </main>
  );
}
