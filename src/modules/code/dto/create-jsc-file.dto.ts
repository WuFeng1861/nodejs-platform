import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJscFileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

