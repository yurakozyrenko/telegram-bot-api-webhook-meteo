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

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ nullable: true })
  time: string; // Время для рассылки, может быть null если не выбрано
}
