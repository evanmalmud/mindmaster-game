import { motion } from 'framer-motion';
import { useState } from 'react';

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

export function Subtitle() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const subtitle = subtitlePhrases[subtitleIndex];

  return (
    <div className="mt-4 flex w-full max-w-xs flex-wrap justify-center gap-4">
      {subtitle.map((word, wordIdx) => {
        const isLastWord = wordIdx === subtitle.length - 1;

        return (
          <div key={wordIdx} className="flex gap-1">
            {word.map((letter, letterIdx) => {
              const isLastLetter = isLastWord && letterIdx === word.length - 1;

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
  );
}
