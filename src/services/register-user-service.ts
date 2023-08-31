import { hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { IUserRepository } from '@/repositories/IUserRepository';
import { EmailIsAlreadyInUseError } from './errors/email-is-already-in-use-error';

interface IRegisterUserServiceInput {
  name: string;
  email: string;
  password: string;
}

interface IRegisterUserServiceOutput {
  user: User;
}

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterUserServiceInput): Promise<IRegisterUserServiceOutput> {
    const userByEmail = await this.userRepository.findByEmail(email);

    if (userByEmail) {
      throw new EmailIsAlreadyInUseError();
    }

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash: await hash(password, 6),
    });

    return {
      user,
    };
  }
}
