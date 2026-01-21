import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { LoadRequest } from './entities/load-request.entity';
import { Load } from '../loads/entities/load.entity';

@Injectable()
export class LoadRequestsService {
  constructor(
    @InjectRepository(LoadRequest)
    private requestRepository: Repository<LoadRequest>,
    @InjectRepository(Load)
    private loadRepository: Repository<Load>,
  ) {}

  // Yeni teklif oluşturma
  create(createLoadRequestDto: any) {
    const newRequest = this.requestRepository.create({
      ...createLoadRequestDto,
      load: { id: createLoadRequestDto.loadId },
      carrier: { id: createLoadRequestDto.carrierId },
    });
    return this.requestRepository.save(newRequest);
  }

  // Tüm teklifleri getir
  findAll() {
    return this.requestRepository.find({
      relations: ['load', 'carrier'],
    });
  }

  // Belirli bir yük için gelen teklifleri getir
  async findByLoad(loadId: string) {
    return this.requestRepository.find({
      where: { load: { id: loadId } },
      relations: ['carrier'], // Şoför bilgisini de getir
      order: { offerPrice: 'ASC' } // En ucuz teklif en üstte olsun
    });
  }

  findOne(id: string) {
    return this.requestRepository.findOne({ where: { id }, relations: ['load'] });
  }

  // --- KRİTİK NOKTA: TEKLİFİ KABUL ETME ---
  async acceptOffer(id: string) {
    // 1. Önce bu teklifi bul
    const request = await this.requestRepository.findOne({ 
      where: { id }, 
      relations: ['load'] 
    });

    if (!request) throw new BadRequestException('Teklif bulunamadı!');

    // 2. Bu teklifi ONAYLA (approved)
    request.status = 'approved';
    await this.requestRepository.save(request);

    // 3. İlanı KAPAT (taken)
    const load = request.load;
    load.status = 'taken';
    await this.loadRepository.save(load);

    // 4. Bu ilana gelen DİĞER tüm teklifleri REDDET (rejected)
    // (Mantık: Aynı ilana ait (load.id), ama bu teklif olmayan (Not id) herkesi reddet)
    await this.requestRepository.update(
      { load: { id: load.id }, id: Not(id) },
      { status: 'rejected' }
    );

    return { message: 'Anlaşma sağlandı! İlan kapatıldı.' };
  }
  // -----------------------------------------

  remove(id: string) {
    return this.requestRepository.delete(id);
  }
}