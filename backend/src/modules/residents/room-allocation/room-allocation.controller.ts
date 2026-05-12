import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete 
} from '@nestjs/common';
import { RoomAllocationService } from './room-allocation.service';
import { CreateRoomAllocationDto } from './dto/assign-room-allocation.dto';
import { I18nLang } from 'nestjs-i18n';
@Controller('api/room-allocation')

export class RoomAllocationController {
  constructor(private readonly roomAllocationService: RoomAllocationService) {}

  /**
   * Unified endpoint to Assign or Update a room allocation.
   * Handles capacity checks, gender validation, and building-room matching.
   */
  @Post('assign')
  async assignRoom(
    @Body() createRoomAllocationDto: CreateRoomAllocationDto,
    @I18nLang() lang: string, // Automatically extracts the requested language from headers
  ) {
    const result = await this.roomAllocationService.assignRoom(createRoomAllocationDto, lang);
    
    return {
      message: result.message,
      data: result.resident
    };
  }

  // =========================================================================
  // Standard View & Delete endpoints
  // =========================================================================

  @Get()
  findAll() {
    return this.roomAllocationService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @I18nLang() lang: string
  ) {
    return this.roomAllocationService.findOne(+id, lang);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @I18nLang() lang: string
  ) {
    return this.roomAllocationService.remove(+id, lang);
  }

}