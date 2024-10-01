import { WorkflowStage } from './enums/WorkflowStage';

type FEIN = string;

type ContactInfo = {
  name: string;
  phone: string;
};

export interface Business {
  fein: FEIN;
  name: string;
  industry?: WorkflowStage;
  contact?: ContactInfo;
}
