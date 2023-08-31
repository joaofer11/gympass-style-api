import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserService } from '@/services/register-user-service';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { EmailIsAlreadyInUseError } from '@/services/errors/email-is-already-in-use-error';

export const registerUserController = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = bodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUserRepository();
    const registerUserService = new RegisterUserService(userRepository);

    const user = await registerUserService.execute({ name, email, password });

    response.status(201).send(user);
  } catch (err) {
    if (err instanceof EmailIsAlreadyInUseError) {
      return response.status(409).send({ message: err.message });
    }

    throw err;
  }
};
