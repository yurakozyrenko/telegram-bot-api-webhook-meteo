import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entity/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<InsertResult> {
    return await this.usersRepository.createQueryBuilder('users').insert().into(User).values(createUserDto).execute();
  }

  async findOneByChatId(chatId: number): Promise<User | null> {
    return await this.usersRepository.createQueryBuilder('users').where('users.chatId = :chatId', { chatId }).getOne();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.createQueryBuilder('users').where('users.id = :id', { id }).getOne();
  }

  async updateUser(chatId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .update(User)
      .set(updateUserDto)
      .where('users.chat_id = :chatId', { chatId })
      .execute();
  }

  async getUserByChatId(chatId: number): Promise<User> {
    return await this.usersRepository.createQueryBuilder('users').where('users.chat_id = :chatId', { chatId }).getOne();
  }

  async getAllUsers(): Promise<[User[], number]> {
    return await this.usersRepository.createQueryBuilder('users').getManyAndCount();
  }
}
