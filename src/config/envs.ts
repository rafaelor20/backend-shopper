import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  let path = '.env'; // default path

  if (process.env.NODE_ENV === 'test') {
    path = '.env.test';
  }

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
