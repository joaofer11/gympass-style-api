import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticateUserService } from '@/services/authenticate-user-service';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';

export const authenticateUserController = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = bodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUserRepository();
    const authenticateUserService = new AuthenticateUserService(userRepository);

    const { user } = await authenticateUserService.execute({
      email,
      password,
    });

    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    return response.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return response.status(400).send({ message: err.message });
    }

    throw err;
  }
};
