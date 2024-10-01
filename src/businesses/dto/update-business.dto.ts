import { IsEmpty, IsString } from 'class-validator';
import { IndustryType } from '../enums/IndustryType';
import { Business } from '../business.interface';

export class UpdateBusinessDto {
  @IsString()
  @IsEmpty()
  industry?: IndustryType;

  @IsEmpty()
  contact?: Business['contact'];

  @IsString()
  @IsEmpty()
  outcome?: 'Win' | 'Lost';
}
