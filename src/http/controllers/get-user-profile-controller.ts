import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { GetUserProfileService } from '@/services/get-user-profile-service';
import { FastifyRequest, FastifyReply } from 'fastify';

export const getUserProfileController = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  const userRepository = new PrismaUserRepository();
  const getUserProfileService = new GetUserProfileService(userRepository);

  const { user } = await getUserProfileService.execute({
    userId: request.user.sub,
  });

  return response.status(200).send({
    ...user,
    passwordHash: undefined,
  });
};
