import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('posts_stats')
export class PostsStats {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  visits: number;

  @Column({ default: 0 })
  comments: number;

  @Column({ default: false })
  comments_restricted: boolean;

  @OneToOne(() => Post, (post) => post.postsStats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  post: Post;
}
