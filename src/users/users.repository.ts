import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<InsertResult> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .insert()
      .into(User)
      .values(createUserDto)
      .execute();
  }

  async updateUser(
    chatId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .update(User)
      .set(updateUserDto)
      .where('users.chatId = :chatId', { chatId: `"${chatId}"` })
      .execute();
  }

  async getUserByChatId(chatId: number): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.chatId = :chatId', { chatId: `"${chatId}"` })
      .getOne();
  }

  async getAllUsers(): Promise<[User[], number]> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .getManyAndCount();
  }
}
