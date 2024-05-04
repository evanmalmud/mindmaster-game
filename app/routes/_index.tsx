import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { ComponentProps } from 'react';

export function meta() {
  return [
    { title: 'MindMaster' },
    { name: 'description', content: 'Break the code...' },
  ];
}

const subtitlePhrases = [
  [
    ['g', 'u', 'e', 's', 's'],
    ['t', 'h', 'e'],
    ['c', 'o', 'l', 'o', 'u', 'r', 's'],
  ],
  [
    ['b', 'r', 'e', 'a', 'k'],
    ['t', 'h', 'e'],
    ['c', 'o', 'd', 'e'],
  ],
];

const subtitleColors = [
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-purple-400',
  'bg-orange-400',
];

export default function Index() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const subtitle = subtitlePhrases[subtitleIndex];

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center lg:max-w-lg">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
          className="font-display text-6xl uppercase"
        >
          Mastermind
        </motion.h1>

        <div className="mt-4 flex w-full max-w-xs flex-wrap justify-center gap-4">
          {subtitle.map((word, wordIdx) => {
            const isLastWord = wordIdx === subtitle.length - 1;

            return (
              <div key={wordIdx} className="flex gap-1">
                {word.map((letter, letterIdx) => {
                  const isLastLetter =
                    isLastWord && letterIdx === word.length - 1;

                  return (
                    <motion.div
                      key={letterIdx}
                      aria-hidden
                      layoutId={`${wordIdx}-${letterIdx}`}
                      animate={{
                        rotateY: subtitleIndex ? 360 : 720,
                      }}
                      initial={{
                        rotateY: 180,
                      }}
                      transition={{
                        delay: 0.75 + letterIdx * 0.1,
                        duration: 0.75,
                        repeat: subtitleIndex ? 0 : 1,
                        repeatDelay: 2,
                        repeatType: 'reverse',
                      }}
                      style={{
                        backfaceVisibility: 'hidden',
                        perspective: 1000,
                        transformStyle: 'preserve-3d',
                      }}
                      onAnimationComplete={
                        isLastLetter ? () => setSubtitleIndex(1) : undefined
                      }
                      className={`flex h-6 w-6 items-center justify-center rounded-full font-display uppercase ${subtitleColors[letterIdx % subtitleColors.length]}`}
                    >
                      {letter}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

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
            transition={{ delay: 0.2, type: 'spring', mass: 2, stiffness: 100 }}
          >
            <Button to={'/login'}>Log In</Button>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 100 }}
            transition={{ delay: 0.4, type: 'spring', mass: 2, stiffness: 100 }}
          >
            <Button to={'/game'} state={{ howToPlay: false }}>
              Play
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
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
