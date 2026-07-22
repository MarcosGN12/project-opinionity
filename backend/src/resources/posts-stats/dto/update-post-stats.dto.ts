import { PartialType } from '@nestjs/mapped-types';
import { CreatePostStatsDto } from './create-post-stats.dto';

export class UpdatePostStatsDto extends PartialType(CreatePostStatsDto) {}
