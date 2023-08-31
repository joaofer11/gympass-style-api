import fastify from 'fastify';
import { scheduleAppRoutes } from './http/schedule-app-routes';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();

app.register(scheduleAppRoutes);

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error);
  }

  return response.status(500).send({ message: 'Internal server error.' });
});
