import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Kullanıcıyı içeri alıyoruz

export enum TrailerType {
  TENTE = 'tente',
  FRIGO = 'frigo',
  DAMPER = 'damper',
  LOWBED = 'lowbed',
  ACIK_KASA = 'acik_kasa',
  KONTEYNER = 'konteyner',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // İLİŞKİ BURADA: Her araç bir kullanıcıya (User) aittir.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // Veritabanındaki kolon adı
  user: User;

  @Column({ name: 'plate_number' })
  plateNumber: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({
    type: 'enum',
    enum: TrailerType,
    name: 'trailer_type',
  })
  trailerType: TrailerType;

  @Column({ name: 'max_weight_kg' })
  maxWeightKg: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}