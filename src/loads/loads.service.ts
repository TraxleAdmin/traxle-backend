import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load } from './entities/load.entity';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Load)
    private loadsRepository: Repository<Load>,
  ) {}

  // --- 1. İLAN OLUŞTURMA KISMI (DÜZELTİLDİ) ---
  async create(createLoadDto: any) {
    // Gelen verideki 'shipperId'yi alıp, veritabanının anlayacağı
    // 'shipper: { id: ... }' formatına çeviriyoruz.
    const newLoad = this.loadsRepository.create({
      ...createLoadDto,
      shipper: { id: createLoadDto.shipperId } // <--- İŞTE EKSİK PARÇA BUYDU!
    });
    return this.loadsRepository.save(newLoad);
  }
  // --------------------------------------------

  // --- 2. LİSTELEME KISMI (DÜZELTİLDİ) ---
 findAll() {
  return this.loadsRepository.find({
    relations: ['shipper'], // <--- BU SATIR ÇOK ÖNEMLİ! İlişkiyi getir diyoruz.
    order: {
      pickupDate: 'DESC', // En yeni ilan en üstte görünsün
    },
  });
}
  // ---------------------------------------

  findOne(id: string) {
    return this.loadsRepository.findOne({
      where: { id },
      relations: ['shipper', 'requests'],
    });
  }

  async update(id: string, updateLoadDto: any) {
      await this.loadsRepository.update(id, updateLoadDto);
      return this.findOne(id);
  }

  remove(id: string) {
    return this.loadsRepository.delete(id);
  }
}