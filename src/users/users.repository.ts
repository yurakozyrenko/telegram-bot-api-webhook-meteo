import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { CreateUserDto } from './dto/createUser.dto';

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

  async getAllUsers(): Promise<[User[], number]> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .getManyAndCount();
  }
}
