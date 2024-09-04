import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class dataParamsCommentDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}

export class createCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
