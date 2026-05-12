import { Module } from '@nestjs/common';
import { RoomAllocationService } from './room-allocation.service';
import { RoomAllocationController } from './room-allocation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [PrismaModule], // And add it here
  controllers: [RoomAllocationController],
  providers: [RoomAllocationService],
})
export class RoomAllocationModule {}