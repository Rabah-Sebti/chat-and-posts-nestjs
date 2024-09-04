import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  tag: string;
}

export class EditPostDto {
  @IsString()
  @IsOptional()
  content?: string;
  @IsString()
  @IsOptional()
  tag?: string;
}
