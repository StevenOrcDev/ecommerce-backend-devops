import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserPasswordResponse } from './models/GetUserPasswordResponse';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    const newUser = await this.usersRepository.save(user);

    delete newUser.password;
    return newUser;
  }

  async getUserPassword(id: string): Promise<GetUserPasswordResponse> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return { password: user.password };
  }

  async findAll() {
    const users = await this.usersRepository.find();

    if (!users) throw new NotFoundException('No users found');

    users?.forEach((user) => {
      delete user?.password;
    });

    return users;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.remove(user);
  }

  async findoneById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    delete user.password;
    return user;
  }

  async resetPassword(id: string, newPassword: string, oldPassword?: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    if (oldPassword && user.password !== oldPassword) {
      throw new NotFoundException('Old password is incorrect');
    }

    user.password = newPassword;
    await this.usersRepository.save(user);

    delete user.password;
    return user;
  }
}
