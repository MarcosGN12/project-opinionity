import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProfilesDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  followers: number;

  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @IsNumber()
  @IsNotEmpty()
  visits: number;

  @IsNumber()
  @IsNotEmpty()
  comments: number;

  @IsNumber()
  @IsNotEmpty()
  posts_number: number;
}
