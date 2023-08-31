import { IUserRepository } from '@/repositories/IUserRepository';
import { User } from '@prisma/client';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';

interface IAuthenticateUserServiceInput {
  email: string;
  password: string;
}

interface IAuthenticateUserServiceOutput {
  user: User;
}

export class AuthenticateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserServiceInput): Promise<IAuthenticateUserServiceOutput> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, user.passwordHash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
