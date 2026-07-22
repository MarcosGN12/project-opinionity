import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostStatsDto } from './dto/create-post-stats.dto';
import { UpdatePostStatsDto } from './dto/update-post-stats.dto';
import { PostsStats } from './entities/post-stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsStatsService {
  constructor(
    @InjectRepository(PostsStats)
    private postsStatsRepository: Repository<PostsStats>,
  ) {}

  async create(createPostStatsDto: CreatePostStatsDto): Promise<PostsStats> {
    const postsStats = this.postsStatsRepository.create(createPostStatsDto);
    return await this.postsStatsRepository.save(postsStats);
  }

  async findAll(): Promise<PostsStats[]> {
    return await this.postsStatsRepository.find();
  }

  async findOne(id: string): Promise<PostsStats> {
    const postsStats = await this.postsStatsRepository.findOne({
      where: { id },
    });
    if (!postsStats) {
      throw new NotFoundException(`PostsStats with ID ${id} not found`);
    }
    return postsStats;
  }

  async update(
    id: string,
    updatePostStatsDto: UpdatePostStatsDto,
  ): Promise<PostsStats> {
    const postsStats = await this.findOne(id);
    const updatedPostsStats = this.postsStatsRepository.merge(
      postsStats,
      updatePostStatsDto,
    );
    return await this.postsStatsRepository.save(updatedPostsStats);
  }

  async remove(id: string): Promise<PostsStats> {
    const postsStats = await this.findOne(id);
    return await this.postsStatsRepository.remove(postsStats);
  }
}
