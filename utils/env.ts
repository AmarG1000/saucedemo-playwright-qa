import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredVariables = ['BASE_URL', 'STANDARD_USER', 'STANDARD_PASSWORD', 'LOCKED_USER'] as const;

for (const name of requiredVariables) {
  if (!process.env[name]?.trim()) {
    throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env and set its value.`);
  }
}

export const env = {
  baseUrl: process.env.BASE_URL!,
  standardUser: process.env.STANDARD_USER!,
  standardPassword: process.env.STANDARD_PASSWORD!,
  lockedUser: process.env.LOCKED_USER!,
};
