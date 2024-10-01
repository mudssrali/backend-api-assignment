import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessController } from './businesses/business.controller';
import { BusinessModule } from './businesses/business.module';

@Module({
  imports: [BusinessModule],
  controllers: [AppController, BusinessController],
  providers: [AppService],
})
export class AppModule {}
