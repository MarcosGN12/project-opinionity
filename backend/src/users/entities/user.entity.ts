import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  gender: string;

  @Column()
  password: string;

  @Column()
  birthDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
