import { FastifyInstance } from 'fastify';
import { registerUserController } from './controllers/register-user-controller';

export const scheduleAppRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUserController);
};
