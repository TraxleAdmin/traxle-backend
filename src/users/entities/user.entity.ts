import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { LoadRequest } from '../../load-requests/entities/load-request.entity';
import { Load } from '../../loads/entities/load.entity'; // <-- Load import edildi

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  role: string; 

  // --- EKLENEN KISIM: Kullanıcının açtığı ilanlar ---
  @OneToMany(() => Load, (load) => load.shipper)
  loads: Load[];
  // --------------------------------------------------

  @OneToMany(() => LoadRequest, (request) => request.carrier)
  requests: LoadRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}