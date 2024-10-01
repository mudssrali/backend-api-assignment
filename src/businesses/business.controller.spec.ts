import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessStage } from './enums/BusinessStage';
import { IndustryType } from './enums/IndustryType';

describe('BusinessController', () => {
  let businessController: BusinessController;
  let businessService: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: {
            createBusiness: jest.fn(),
            getBusinessById: jest.fn(),
            getBusinessByFein: jest.fn(),
            updateBusinessStage: jest.fn(),
          },
        },
      ],
    }).compile();

    businessController = module.get<BusinessController>(BusinessController);
    businessService = module.get<BusinessService>(BusinessService);
  });

  describe('createBusiness', () => {
    it('should return success response with created business data', () => {
      const createBusinessDto: CreateBusinessDto = {
        fein: '123456789',
        name: 'Test Business',
      };

      const result = {
        id: 1,
        fein: '123456789',
        name: 'Test Business',
        stage: BusinessStage.NEW,
      };

      jest.spyOn(businessService, 'createBusiness').mockReturnValue(result);

      expect(businessController.createBusiness(createBusinessDto)).toEqual({
        status: 'success',
        data: result,
      });
    });
  });

  describe('getBusinessById', () => {
    it('should return success response with business data when found', () => {
      const result = {
        id: 1,
        fein: '123456789',
        name: 'Test Business',
        stage: BusinessStage.NEW,
      };

      jest.spyOn(businessService, 'getBusinessById').mockReturnValue(result);

      expect(businessController.getBusinessById(1)).toEqual({
        status: 'success',
        data: result,
      });
    });

    it('should throw NotFoundException when business is not found', () => {
      jest.spyOn(businessService, 'getBusinessById').mockReturnValue(undefined);

      expect(() => businessController.getBusinessById(1)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('getBusinessByFein', () => {
    it('should return success response with business data when found', () => {
      const result = {
        id: 1,
        fein: '123456789',
        name: 'Test Business',
        stage: BusinessStage.NEW,
      };

      jest.spyOn(businessService, 'getBusinessByFein').mockReturnValue(result);

      expect(businessController.getBusinessByFein('123456789')).toEqual({
        status: 'success',
        data: result,
      });
    });

    it('should throw NotFoundException when business is not found', () => {
      jest
        .spyOn(businessService, 'getBusinessByFein')
        .mockReturnValue(undefined);

      expect(() => businessController.getBusinessByFein('123456789')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBusinessStage', () => {
    let business;

    beforeEach(() => {
      // Initial business that starts at NEW stage
      business = {
        id: 1,
        fein: '123456789',
        name: 'Test Business',
        stage: BusinessStage.NEW,
        industry: null,
        contact: null,
      };

      jest.spyOn(businessService, 'getBusinessById').mockReturnValue(business);
    });

    it('should update business stage from NEW to MARKET_APPROVED when industry is supported', () => {
      const updateBusinessDto: UpdateBusinessDto = {
        industry: IndustryType.RESTAURANTS,
      };

      // Updated result after stage progression
      const updatedBusiness = {
        ...business,
        industry: IndustryType.RESTAURANTS,
        stage: BusinessStage.MARKET_APPROVED,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockReturnValue(updatedBusiness);

      expect(
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toEqual({
        status: 'success',
        data: updatedBusiness,
      });
    });

    it('should update business stage from MARKET_APPROVED to SALES_APPROVED when valid contact is provided', () => {
      // Set business at MARKET_APPROVED stage
      business.stage = BusinessStage.MARKET_APPROVED;
      business.industry = IndustryType.RESTAURANTS;

      const updateBusinessDto: UpdateBusinessDto = {
        contact: {
          name: 'Mudassar',
          phone: '1234567890',
        },
      };

      const updatedBusiness = {
        ...business,
        contact: {
          name: 'Mudassar',
          phone: '1234567890',
        },
        stage: BusinessStage.SALES_APPROVED,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockReturnValue(updatedBusiness);

      expect(
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toEqual({
        status: 'success',
        data: updatedBusiness,
      });
    });

    it('should update business stage from SALES_APPROVED to WON when outcome is "Win"', () => {
      // Set business at SALES_APPROVED stage
      business.stage = BusinessStage.SALES_APPROVED;
      business.contact = {
        name: 'Mudassar',
        phone: '1234567890',
      };

      const updateBusinessDto: UpdateBusinessDto = {
        outcome: 'Win',
      };

      const updatedBusiness = {
        ...business,
        stage: BusinessStage.WON,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockReturnValue(updatedBusiness);

      expect(
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toEqual({
        status: 'success',
        data: updatedBusiness,
      });
    });

    it('should update business stage from SALES_APPROVED to LOST when outcome is "Lost"', () => {
      // Set business at SALES_APPROVED stage
      business.stage = BusinessStage.SALES_APPROVED;
      business.contact = {
        name: 'Mudassar',
        phone: '1234567890',
      };

      const updateBusinessDto: UpdateBusinessDto = {
        outcome: 'Lost',
      };

      const updatedBusiness = {
        ...business,
        stage: BusinessStage.LOST,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockReturnValue(updatedBusiness);

      expect(
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toEqual({
        status: 'success',
        data: updatedBusiness,
      });
    });

    it('should throw error if required industry is missing in NEW stage', () => {
      const updateBusinessDto: UpdateBusinessDto = {
        industry: undefined,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockImplementation(() => {
          throw new Error('Industry is required to progress');
        });

      expect(() =>
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toThrow('Industry is required to progress');
    });

    it('should throw error if contact details are missing in MARKET_APPROVED stage', () => {
      business.stage = BusinessStage.MARKET_APPROVED;
      const updateBusinessDto: UpdateBusinessDto = {
        contact: undefined, // Contact details missing
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockImplementation(() => {
          throw new Error('Valid contact details are required');
        });

      expect(() =>
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toThrow('Valid contact details are required');
    });

    it('should throw error if outcome is missing in SALES_APPROVED stage', () => {
      business.stage = BusinessStage.SALES_APPROVED;
      const updateBusinessDto: UpdateBusinessDto = {
        outcome: undefined,
      };

      jest
        .spyOn(businessService, 'updateBusinessStage')
        .mockImplementation(() => {
          throw new Error("Specify 'Win' or 'Lost' to proceed further");
        });

      expect(() =>
        businessController.updateBusinessStage(1, updateBusinessDto),
      ).toThrow("Specify 'Win' or 'Lost' to proceed further");
    });
  });
});
