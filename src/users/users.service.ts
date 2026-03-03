import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  // --- KESİN ÇÖZÜM: Promise<any> ---
  async create(createUserDto: any): Promise<any> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findOne(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll() {
    return this.usersRepository.find();
  }

  // 🔥 DÜZELTME BURADA: Fonksiyon class'ın (süslü parantezlerin) İÇİNE alındı!
  async updatePassword(email: string, newPassword: string) {
    return await this.usersRepository.update(
      { email: email },
      { password: newPassword }
    );
  }
}