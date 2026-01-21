import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { LoadsService } from './loads.service';

@Controller('loads')
export class LoadsController {
  private readonly logger = new Logger(LoadsController.name);

  constructor(private readonly loadsService: LoadsService) {}

  @Post()
  create(@Body() createLoadDto: any) {
    this.logger.log(`Yeni yük ekleniyor: ${JSON.stringify(createLoadDto)}`);
    return this.loadsService.create(createLoadDto);
  }

  @Get()
  findAll() {
    this.logger.log('Tüm yükler listeleniyor...');
    return this.loadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadsService.findOne(id);
  }
}