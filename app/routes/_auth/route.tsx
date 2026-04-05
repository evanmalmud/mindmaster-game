import type { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet } from '@remix-run/react';
import { ArrowLeftCircleIcon } from 'lucide-react';

import { authenticator } from '~/services/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return null;
}

export default function AuthLayout() {
  return (
    <>
      <header className="sticky top-0 z-40 grid grid-cols-3 items-center border-b border-neutral-400 bg-background/80 px-4 py-2 backdrop-blur-sm md:py-4">
        <Link to="/">
          <ArrowLeftCircleIcon />
        </Link>

        <h1 className="justify-self-center font-display text-lg uppercase md:text-2xl">
          MindMaster
        </h1>
      </header>

      <Outlet />
    </>
  );
}
