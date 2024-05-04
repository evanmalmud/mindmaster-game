import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

import { authenticator } from '~/services/auth.server';

import { Header } from '../_default/header';

import { Subtitle } from './subtitle';

export function meta() {
  return [
    { title: 'MindMaster' },
    { name: 'description', content: 'Break the code...' },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      {user ? <Header user={user} /> : null}

      <main className="flex flex-col items-center justify-center pt-20 lg:pt-40">
        <div className="flex w-full max-w-md flex-col items-center lg:max-w-lg">
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
            className="font-display text-6xl uppercase"
          >
            Mastermind
          </motion.h1>

          <Subtitle />

          <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 100 }}
              transition={{
                type: 'spring',
                mass: 2,
                stiffness: 100,
              }}
            >
              <Button to={'/game'} state={{ howToPlay: true }}>
                How To Play
              </Button>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 100 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                mass: 2,
                stiffness: 100,
              }}
            >
              <Button to={user ? '/stats' : '/login'}>
                {user ? 'View Stats' : 'Log In'}
              </Button>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 100 }}
              transition={{
                delay: 0.4,
                type: 'spring',
                mass: 2,
                stiffness: 100,
              }}
            >
              <Button to={'/game'} state={{ howToPlay: false }}>
                Play
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

function Button({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="font-matter group flex h-[60px] w-full items-center justify-center whitespace-nowrap rounded-3xl border-2 border-neutral-700 px-8 py-4 text-sm font-semibold uppercase leading-none shadow-input-idle transition-all duration-150 ease-in-out will-change-transform hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink active:duration-100"
    >
      {children}
    </Link>
  );
}
