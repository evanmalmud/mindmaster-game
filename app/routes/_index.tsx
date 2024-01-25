import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export function meta() {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  return user;
};

export default function Index() {
  const user = useLoaderData();
  return (
    <div>
      <nav className="fixed left-0 top-0 w-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-500 px-5">
        <div className="mx-auto flex w-full max-w-screen-lg content-center justify-between py-3 ">
          <Link className="text-3xl font-bold text-white" to={'/'}>
            Plot Points
          </Link>
          <div className="flex flex-col items-center justify-between gap-x-4 text-blue-50 md:flex-row">
            <h1>Welcome to Remix</h1>
            <h1>Logged in as ...</h1>

            <Link to={'login'}>Login</Link>
            <Link to={'login'}>Register</Link>
          </div>
        </div>
      </nav>
      <div className="grid grid-cols-1 lg:grid-flow-row lg:grid-cols-3">
        <figure className="m-4 px-4 py-10 shadow-md shadow-sky-100">
          <blockquote cite="https://wisdomman.com" className="py-3">
            <p className="text-xl  text-gray-800">
              A stitch in Time saves Nine.
            </p>
          </blockquote>
          <figcaption>
            <cite className="text-md mb-4 text-right text-gray-600">
              - Unknown
            </cite>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
