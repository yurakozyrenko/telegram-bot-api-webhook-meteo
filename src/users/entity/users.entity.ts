import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { bigintTransformer } from '../../utils/bigintTransformer';
import { UserState } from '../users.constants';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    transformer: bigintTransformer,
    unique: true,
  })
  chatId: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  city: string;

  @Column({ type: 'enum', enum: UserState, default: 'start' })
  userState: UserState;
}
