import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoadRequestsService } from './load-requests.service';

@Controller('load-requests')
export class LoadRequestsController {
  constructor(private readonly loadRequestsService: LoadRequestsService) {}

  @Post()
  create(@Body() createLoadRequestDto: any) {
    return this.loadRequestsService.create(createLoadRequestDto);
  }

  @Get()
  findAll() {
    return this.loadRequestsService.findAll();
  }

  // Belirli bir ilana gelen teklifleri görmek için
  @Get('load/:loadId')
  findByLoad(@Param('loadId') loadId: string) {
    return this.loadRequestsService.findByLoad(loadId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadRequestsService.findOne(id);
  }

  // --- KABUL ETME BUTONU ---
  @Patch(':id/accept')
  acceptOffer(@Param('id') id: string) {
    return this.loadRequestsService.acceptOffer(id);
  }
  // -------------------------

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadRequestsService.remove(id);
  }
}