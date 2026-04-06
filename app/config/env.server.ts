/**
 * Ensures env vars are properly set for application to run. Should match what
 * is declared in .env.example.
 *
 * In mock mode (MOCK_DATA=true), defaults are provided so no .env file is needed.
 */
import { z } from 'zod';

const isMock = process.env.MOCK_DATA === 'true';

const str = isMock ? z.string().default('mock-placeholder') : z.string();

const envSchema = z.object({
  ENCRYPTION_SECRET: str,
  GOOGLE_CALLBACK_URL: str,
  GOOGLE_CLIENT_ID: str,
  GOOGLE_CLIENT_SECRET: str,
  NODE_ENV: z.union([
    z.literal('production'),
    z.literal('development'),
    z.literal('test'),
  ]),
  RESEND_API_KEY: str,
  SESSION_SECRET: str,
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
