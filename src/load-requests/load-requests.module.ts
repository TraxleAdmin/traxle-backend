import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadRequestsService } from './load-requests.service';
import { LoadRequestsController } from './load-requests.controller';
import { LoadRequest } from './entities/load-request.entity';
import { Load } from '../loads/entities/load.entity'; // <-- Load eklendi

@Module({
  imports: [TypeOrmModule.forFeature([LoadRequest, Load])], // <-- Load buraya da eklendi
  controllers: [LoadRequestsController],
  providers: [LoadRequestsService],
})
export class LoadRequestsModule {}