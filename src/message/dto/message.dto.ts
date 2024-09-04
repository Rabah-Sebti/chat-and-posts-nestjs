import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class dataParamsMessageDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   from: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  sender: string;
}
