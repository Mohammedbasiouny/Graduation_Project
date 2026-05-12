import { Module } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { RoomAllocationModule } from './room-allocation/room-allocation.module';

@Module({
  controllers: [ResidentsController],
  providers: [ResidentsService],
  imports: [RoomAllocationModule],
})
export class ResidentsModule {}
