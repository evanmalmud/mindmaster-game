import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import { authenticator } from '~/services/auth.server';

import { Header } from './header';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Header user={user} />

      <Outlet />
    </>
  );
}
