import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  followers: number;

  @Column({ default: 0 })
  following: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  visits: number;

  @Column({ default: 0 })
  comments: number;

  @Column({ default: 0 })
  posts_number: number;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
