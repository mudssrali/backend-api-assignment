import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';

@Module({
  imports: [],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
