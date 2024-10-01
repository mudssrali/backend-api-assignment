import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Business } from './business.interface';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessStage } from './enums/BusinessStage';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { IndustryType } from './enums/IndustryType';

@Injectable()
export class BusinessService {
  // in-memory storage for businesses
  private businesses: Business[] = [];

  // supported industries for Market Approved stage
  private readonly supportedIndustries = [
    IndustryType.RESTAURANTS,
    IndustryType.STORES,
  ];

  constructor() {}

  createBusiness(createBusinessDto: CreateBusinessDto): Business {
    const { fein, name } = createBusinessDto;

    const newBusiness: Business = {
      id: this.businesses.length + 1,
      fein,
      name,
      stage: BusinessStage.NEW,
    };

    const existingBusiness = this.getBusinessByFein(fein);

    if (existingBusiness) {
      throw new ConflictException('Business with this fein already exists');
    }

    this.businesses.push(newBusiness);

    return newBusiness;
  }

  getBusinessById(id: number): Business | undefined {
    return this.businesses.find((business) => business.id === id);
  }

  getBusinessByFein(fein: Business['fein']): Business | undefined {
    return this.businesses.find((business) => business.fein === fein);
  }

  updateBusinessStage(
    businessId: number,
    updateBusinessDto: UpdateBusinessDto,
  ): Business {
    const { industry, contact, outcome } = updateBusinessDto;

    const existingBusiness = this.getBusinessById(businessId);

    if (!existingBusiness) {
      throw new NotFoundException('Business not found');
    }

    const business = { ...existingBusiness };

    switch (existingBusiness.stage) {
      case BusinessStage.NEW:
        if (!industry) {
          throw new Error('Industry is required to progress');
        }

        business.industry = industry;

        if (this.supportedIndustries.includes(industry)) {
          business.stage = BusinessStage.MARKET_APPROVED;
        } else {
          business.stage = BusinessStage.MARKET_DECLINED;
        }

        break;
      case BusinessStage.MARKET_APPROVED:
        if (!(contact?.name && contact?.phone)) {
          throw new Error('Valid contact details are required');
        }

        business.contact = contact;
        business.stage = BusinessStage.SALES_APPROVED;
        break;

      case BusinessStage.SALES_APPROVED:
        if (outcome === 'Win') {
          business.stage = BusinessStage.WON;
        } else if (outcome === 'Lost') {
          business.stage = BusinessStage.LOST;
        } else {
          throw new Error("Specify 'Win' or 'Lost' to proceed further");
        }

        break;

      default:
        throw new Error('Cannot progress further from this stage');
    }

    return business;
  }
}
