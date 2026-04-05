import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import { getUserStats } from '~/routes/_default.game/game.server';
import { authenticator } from '~/services/auth.server';
import { getStatsFromCookie } from '~/services/stats-cookie.server';

export function meta() {
  return [
    { title: 'MindMaster - Stats' },
    { name: 'description', content: 'Your MindMaster statistics' },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const stats = await getUserStats(user.id);
    return json({ stats, userName: user.name, isLoggedIn: true });
  }

  // Anonymous stats from cookie
  const cookieStats = await getStatsFromCookie(request);
  const winPercentage =
    cookieStats.totalGames > 0
      ? Math.round((cookieStats.totalWins / cookieStats.totalGames) * 100)
      : 0;

  return json({
    stats: {
      totalGames: cookieStats.totalGames,
      totalWins: cookieStats.totalWins,
      winPercentage,
      currentStreak: cookieStats.currentStreak,
      maxStreak: cookieStats.maxStreak,
      distribution: cookieStats.distribution,
    },
    userName: null,
    isLoggedIn: false,
  });
}

export default function Stats() {
  const { stats, userName, isLoggedIn } = useLoaderData<typeof loader>();
  const maxDistValue = Math.max(...Object.values(stats.distribution), 1);

  return (
    <main className="flex flex-col items-center px-4 pt-8 lg:pt-16">
      <div className="w-full max-w-md">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-center text-4xl uppercase">
            Stats
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {userName ? `${userName}'s performance` : 'Your performance'}
          </p>
        </motion.div>

        {!isLoggedIn && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-4 rounded-lg border border-code-yellow/40 bg-code-yellow/10 p-3 text-center"
          >
            <p className="text-sm text-foreground/80">
              <Link to="/login" className="font-semibold underline">
                Log in
              </Link>{' '}
              to save your stats permanently across devices.
            </p>
          </motion.div>
        )}

        {/* Summary cards */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-8 grid grid-cols-4 gap-3"
        >
          <StatCard value={stats.totalGames} label="Played" />
          <StatCard value={`${stats.winPercentage}%`} label="Win %" />
          <StatCard value={stats.currentStreak} label="Current" subtitle="Streak" />
          <StatCard value={stats.maxStreak} label="Best" subtitle="Streak" />
        </motion.div>

        {/* Guess distribution */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-8"
        >
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide">
            Guess Distribution
          </h2>

          <div className="flex flex-col gap-1.5">
            {Object.entries(stats.distribution).map(([guess, count]) => (
              <div key={guess} className="flex items-center gap-2">
                <span className="w-4 text-right text-sm font-semibold">
                  {guess}
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.max(
                      (count / maxDistValue) * 100,
                      count > 0 ? 8 : 2,
                    )}%`,
                  }}
                  transition={{ delay: 0.3 + Number(guess) * 0.05, duration: 0.4 }}
                  className="flex min-w-[24px] items-center justify-end rounded bg-code-green px-2 py-0.5"
                >
                  <span className="text-xs font-bold text-white">{count}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link
            to="/game"
            className="font-matter rounded-3xl border-2 border-neutral-700 px-8 py-3 text-sm font-semibold uppercase shadow-input-idle transition-all duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink"
          >
            Play
          </Link>
          <Link
            to="/"
            className="font-matter rounded-3xl border-2 border-neutral-700 px-8 py-3 text-sm font-semibold uppercase shadow-input-idle transition-all duration-150 ease-in-out hover:translate-y-[-2px] hover:shadow-input-grow active:translate-y-[2px] active:shadow-input-shrink"
          >
            Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function StatCard({
  value,
  label,
  subtitle,
}: {
  value: string | number;
  label: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-neutral-600 bg-card p-3">
      <span className="font-display text-2xl">{value}</span>
      <span className="text-[11px] font-medium uppercase text-muted-foreground">
        {label}
      </span>
      {subtitle && (
        <span className="text-[10px] text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}
