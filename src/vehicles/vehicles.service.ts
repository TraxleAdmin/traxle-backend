import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  findAll() {
    // relations: ['user'] sayesinde aracın sahibini de getirir!
    return this.vehiclesRepository.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.vehiclesRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }
}