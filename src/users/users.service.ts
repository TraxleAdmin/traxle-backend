import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // --- KESİN ÇÖZÜM: Promise<any> ---
  // TypeScript'e "Dönüş tipini sorgulama, ne gelirse kabul et" diyoruz.
  async create(createUserDto: any): Promise<any> {
    const newUser = this.usersRepository.create(createUserDto);
    // Burada da 'await' kullanarak işlemin bitmesini garanti ediyoruz.
    return await this.usersRepository.save(newUser);
  }
  // ----------------------------------

  async findOne(email: string) {
    // Veritabanında bu email var mı diye bakar
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll() {
    return this.usersRepository.find();
  }
}