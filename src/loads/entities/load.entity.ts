import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LoadRequest } from '../../load-requests/entities/load-request.entity';

@Entity('loads')
export class Load {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pickup_city' })
  pickupCity: string;

  @Column({ name: 'delivery_city' })
  deliveryCity: string;

  @Column({ type: 'decimal' }) 
  price: number;

  @Column({ name: 'load_type', nullable: true }) 
  loadType: string;

  @Column({ name: 'trailer_type', nullable: true }) 
  trailerType: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'pickup_date', nullable: true })
  pickupDate: Date;

  @Column({ default: 'active' }) // active, taken, completed
  status: string;

  // --- KRİTİK DÜZELTME BURADA ---
  // { eager: true } ekledik. Artık vitrinde kimin yüklediği görünecek.
  @ManyToOne(() => User, (user) => user.loads, { eager: true })
  shipper: User;
  // -----------------------------

  @OneToMany(() => LoadRequest, (request) => request.load)
  requests: LoadRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}