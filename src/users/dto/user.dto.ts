import { IsInt, IsString, Length } from 'class-validator';

import { User } from '../entity/users.entity';

export class UserDto {
  @IsInt()
  @Length(5, 11)
  chatId: User['chatId'];

  @IsString()
  @Length(1, 20)
  city: User['city'];

  @IsString()
  time: User['time'];
}
