import { IsInt, Length } from 'class-validator';

import { User } from '../entity/users.entity';

export class UserDto {
  @IsInt()
  @Length(5, 11)
  chatId: User['chatId'];
}
