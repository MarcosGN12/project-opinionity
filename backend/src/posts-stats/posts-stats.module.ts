import { Module } from '@nestjs/common';
import { PostsStatsService } from './posts-stats.service';
import { PostsStatsController } from './posts-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsStats } from './entities/post-stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsStats])],
  controllers: [PostsStatsController],
  providers: [PostsStatsService],
})
export class PostsStatsModule {}
