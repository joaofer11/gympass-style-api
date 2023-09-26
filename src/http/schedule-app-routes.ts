import { FastifyInstance } from 'fastify';
import { registerUserController } from './controllers/register-user-controller';
import { getUserProfileController } from './controllers/get-user-profile-controller';
import { authenticateUserController } from './controllers/authenticate-user-controller';
import { verifyJWT } from './middlewares/verify-jwt';

export const scheduleAppRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerUserController);
  app.post('/sessions', authenticateUserController);

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, getUserProfileController);
};
