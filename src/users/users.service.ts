import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entity/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOneByChatId(chatId: User['chatId']): Promise<User> {
    this.logger.log(`Trying to user info by chatId: ${chatId}`);

    const existingUser = await this.usersRepository.findOneByChatId(chatId);

    if (!existingUser) {
      this.logger.error(`user with chatId: ${chatId} not found`);
    }

    return existingUser;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Trying to create user`);

    const { chatId } = createUserDto;

    const user = await this.usersRepository.findOneByChatId(chatId);

    if (user) {
      this.logger.error(`user with chatId ${chatId} already exists`);
      throw new HttpException(`user with chatId: ${chatId} already exist`, HttpStatus.BAD_REQUEST);
    }

    const { raw } = await this.usersRepository.createUser(createUserDto);

    const id = raw[0].id;

    const newUser = await this.usersRepository.findOneById(id);

    this.logger.debug(`user successfully created with chatId: ${chatId}`);

    return newUser;
  }

  async updateUserCity(chatId: number, { city, userState }: UpdateUserDto) {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const user = await this.usersRepository.getUserByChatId(chatId);

    if (!user) {
      this.logger.error(`user with chatId: ${chatId} not exist`);
      throw new HttpException(`user with chatId: ${chatId} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { time } = user;

    const { affected } = await this.usersRepository.updateUser(chatId, {
      city,
      time,
      userState,
    });

    this.logger.debug(`${affected} user successfully updated by chatId: ${chatId}`);
  }

  async updateUserState(chatId: number, { userState }: UpdateUserDto) {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const user = await this.usersRepository.getUserByChatId(chatId);

    if (!user) {
      this.logger.error(`user with chatId: ${chatId} not exist`);
      throw new HttpException(`user with chatId: ${chatId} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { affected } = await this.usersRepository.updateUser(chatId, {
      userState,
    });

    this.logger.debug(`${affected} user successfully updated by chatId: ${chatId}`);
  }

  async updateUserTime(chatId: number, { time, userState }: UpdateUserDto) {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const user = await this.usersRepository.getUserByChatId(chatId);

    if (!user) {
      this.logger.error(`user with chatId: ${chatId} not exist`);
      throw new HttpException(`user with chatId: ${chatId} not exist`, HttpStatus.BAD_REQUEST);
    }

    const { city } = user;

    const { affected } = await this.usersRepository.updateUser(chatId, {
      city,
      time,
      userState,
    });

    this.logger.debug(`${affected} user successfully updated by chatId: ${chatId}`);
  }

  async getUserByChatId(chatId: number): Promise<User> {
    this.logger.log(`Trying to get user by chatId: ${chatId} `);

    const foundUser = this.usersRepository.getUserByChatId(chatId);

    return foundUser;
  }

  async getAllUsers(): Promise<User[]> {
    this.logger.log(`Trying to get all Users `);

    const [users, count] = await this.usersRepository.getAllUsers();

    this.logger.debug(`${count} all Users successfully get `);

    return users;
  }
}
