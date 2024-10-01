import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  fein: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
