import { Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const { chatId } = createUserDto;
    this.logger.log(`Trying to create user by apiId chatId: ${chatId}`);

    const { raw } = await this.usersRepository.createUser(createUserDto);

    this.logger.debug(`user successfully created with id: ${raw[0].id}`);
  }

  async getAllUsers(): Promise<any> {
    this.logger.log(`Trying to get all Users `);

    const [users, count] = await this.usersRepository.getAllUsers();

    this.logger.debug(`${count} all Users successfully get `);

    return users;
  }
}
