import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

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
}
