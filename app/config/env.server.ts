/**
 * Ensures env vars are properly set for application to run. Should match what
 * is declared in .env.example.
 */
import { z } from 'zod';

const envSchema = z.object({
  ENCRYPTION_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NODE_ENV: z.union([
    z.literal('production'),
    z.literal('development'),
    z.literal('test'),
  ]),
  RESEND_API_KEY: z.string(),
  SESSION_SECRET: z.string(),
});

export const {
  ENCRYPTION_SECRET,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV,
  RESEND_API_KEY,
  SESSION_SECRET,
} = envSchema.parse(process.env);
