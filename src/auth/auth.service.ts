import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // KULLANICIYI DOĞRULAYAN FONKSİYON
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    
    // Kullanıcı var mı? VARSA şifresi eşleşiyor mu?
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result; // Başarılı, kullanıcıyı döndür
    }
    return null; // Başarısız, null döndür
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user, 
    };
  }
}