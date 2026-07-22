import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsStatsService } from './posts-stats.service';
import { CreatePostStatsDto } from './dto/create-post-stats.dto';
import { UpdatePostStatsDto } from './dto/update-post-stats.dto';

@Controller('posts-stats')
export class PostsStatsController {
  constructor(private readonly postsStatsService: PostsStatsService) {}

  @Post()
  create(@Body() createPostStatsDto: CreatePostStatsDto) {
    return this.postsStatsService.create(createPostStatsDto);
  }

  @Get()
  findAll() {
    return this.postsStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsStatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostStatsDto: UpdatePostStatsDto,
  ) {
    return this.postsStatsService.update(id, updatePostStatsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsStatsService.remove(id);
  }
}
