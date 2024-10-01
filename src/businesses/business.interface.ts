import { IndustryType } from './enums/IndustryType';
import { BusinessStage } from './enums/BusinessStage';

type FEIN = string;

type Contact = {
  name: string;
  phone: string;
};

export interface Business {
  id: number;
  fein: FEIN;
  name: string;
  industry?: IndustryType | null;
  contact?: Contact | null;
  stage: BusinessStage;
}
