import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(4000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const msg = 'Has occurred an error at environment variables!';

  console.error(msg, parsedEnv.error.format());

  throw new Error(msg);
}

export const env = parsedEnv.data;
