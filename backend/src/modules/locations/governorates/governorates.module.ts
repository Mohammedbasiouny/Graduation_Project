import { Module } from '@nestjs/common';
import { GovernoratesService } from './governorates.service';
import { GovernoratesController } from './governorates.controller';

@Module({
  controllers: [GovernoratesController],
  providers: [GovernoratesService],
})
export class GovernoratesModule {}
