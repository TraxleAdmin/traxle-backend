import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { LoadRequest } from '../../load-requests/entities/load-request.entity';
import { Load } from '../../loads/entities/load.entity';

@Entity('users')
export class User {
  // 🔥 KRİTİK DEĞİŞİKLİK: 
  // Artık ID'yi veritabanı üretmiyor, Firebase'den gelen String ID'yi (UID) anahtar yapıyoruz.
  @PrimaryColumn() 
  id: string;

  @Column({ name: 'full_name', nullable: true }) // İsim bazen boş gelebilir, hata vermesin diye nullable yaptık
  fullName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true }) // Rol henüz atanmamış olabilir
  role: string;
  
  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Load, (load) => load.shipper)
  loads: Load[];

  @OneToMany(() => LoadRequest, (request) => request.carrier)
  requests: LoadRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}