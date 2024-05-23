import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { bigintTransformer } from '../../utils/bigintTransformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    transformer: bigintTransformer,
  })
  chatId: number;
}
