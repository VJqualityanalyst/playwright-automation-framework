import dotenv from 'dotenv';
import path from 'path';

// Which environment to run against: qa (default), staging, prod...
// Set it with: npm run test:staging, or TEST_ENV=staging
export const testEnv = process.env.TEST_ENV || 'qa';

// Load values from .env.qa, .env.staging, etc. into process.env
dotenv.config({ path: path.resolve(process.cwd(), `.env.${testEnv}`), quiet: true });

// Read a value, and stop with a clear message if it is missing
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing "${name}". Add it to .env.${testEnv} (copy .env.example to get started).`
    );
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  username: required('APP_USERNAME'),
  password: required('APP_PASSWORD'),
};
