import { FastifyRequest, FastifyReply } from 'fastify';

export const verifyJWT = async (
  request: FastifyRequest,
  response: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return response.status(401).send({ message: 'Unauthorized' });
  }
};
