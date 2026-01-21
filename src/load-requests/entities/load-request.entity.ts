import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Load } from '../../loads/entities/load.entity';
import { User } from '../../users/entities/user.entity';

@Entity('load_requests')
export class LoadRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pending' }) // pending, approved, rejected
  status: string;

  @Column({ type: 'decimal', nullable: true }) 
  offerPrice: number; 

  @ManyToOne(() => Load, (load) => load.requests)
  load: Load;

  // --- KRİTİK DÜZELTME BURADA ---
  // { eager: true } ekledik. Artık teklifi kimin verdiği görünecek.
  @ManyToOne(() => User, (user) => user.requests, { eager: true })
  carrier: User;
  // -----------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}