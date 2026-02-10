import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

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

  async getUserPassword(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user?.password;
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return users?.forEach((user) => {
      delete user?.password;
    });
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
}
