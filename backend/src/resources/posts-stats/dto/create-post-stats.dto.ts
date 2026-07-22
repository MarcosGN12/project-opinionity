import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePostStatsDto {
  @IsInt()
  @IsNotEmpty()
  likes: number;

  @IsInt()
  @IsNotEmpty()
  visits: number;

  @IsInt()
  @IsNotEmpty()
  comments: number;

  @IsBoolean()
  @IsNotEmpty()
  comments_restricted: boolean;
}
