import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const { chatId, city } = createUserDto;
    this.logger.log(`Trying to create user chatId: ${chatId} and city ${city}`);

    const { raw } = await this.usersRepository.createUser(createUserDto);

    this.logger.debug(`user successfully created with id: ${raw[0].id}`);
  }

  async updateUser(chatId: number, city: string) {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const user = this.usersRepository.getUserByChatId(chatId);

    if (!user) {
      this.logger.error(`user with chatId: ${chatId} not exist`);
      throw new HttpException(
        `user with chatId: ${chatId} not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { affected } = await this.usersRepository.updateUser(chatId, {
      city,
    });

    this.logger.debug(
      `${affected} user successfully updated by chatId: ${chatId}`,
    );

    // user.city = city;
    // this.users.set(chatId, user);
  }

  async getUserByChatId(chatId: number) {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const foundUser = this.usersRepository.getUserByChatId(chatId);

    return foundUser;
  }

  async getAllUsers(): Promise<any> {
    this.logger.log(`Trying to get all Users `);

    const [users, count] = await this.usersRepository.getAllUsers();

    this.logger.debug(`${count} all Users successfully get `);

    return users;
  }
}
