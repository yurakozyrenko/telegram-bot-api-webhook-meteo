import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { bigintTransformer } from '../../utils/bigintTransformer';
import { UserState } from '../users.constants';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    transformer: bigintTransformer,
  })
  chatId: number;

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ nullable: true })
  time: string; // Время для рассылки, может быть null если не выбрано

  @Column({ type: 'enum', enum: UserState, default: null })
  userState: UserState;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
