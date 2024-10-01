import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Post('create')
  createBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    const data = this.businessService.createBusiness(createBusinessDto);

    return {
      status: 'success',
      data,
    };
  }

  @Get(':id')
  getBusinessById(@Param('id') id: number) {
    const business = this.businessService.getBusinessById(Number(id));

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return {
      status: 'success',
      data: business,
    };
  }

  @Get(':fein')
  getBusinessByFein(@Param('fein') fein: string) {
    const business = this.businessService.getBusinessByFein(fein);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return {
      status: 'success',
      data: business,
    };
  }

  @Post(':id/update-stage')
  updateBusinessStage(
    @Param('id') id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    const data = this.businessService.updateBusinessStage(
      Number(id),
      updateBusinessDto,
    );

    return {
      status: 'success',
      data,
    };
  }
}
