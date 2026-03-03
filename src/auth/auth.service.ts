import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service'; // 👈 EKLENDİ: Postacı servisi

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService // 👈 EKLENDİ: Servisi içeri aldık
  ) {}

  // --- YENİ EKLENEN: KAYIT OLMA FONKSİYONU ---
  async register(createUserDto: any) {
    // 1. Rastgele 6 haneli doğrulama kodu üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Kullanıcıyı oluştur (Kodu ve Onay Durumunu da ekle)
    const newUser = await this.usersService.create({
      ...createUserDto,
      verificationCode: code, // Kod veritabanına yazılıyor
      isVerified: false       // Henüz doğrulanmadı
    });

    // 3. E-postayı gönder (Arka planda çalışır)
    await this.mailService.sendVerificationCode(newUser.email, code);

    // 4. Sonuç dön
    return { 
      message: 'Kayıt başarılı! Lütfen e-postanızı kontrol edin.',
      userId: newUser.id 
    };
  }
  // ---------------------------------------------

  // KULLANICIYI DOĞRULAYAN FONKSİYON
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    
    // Kullanıcı var mı? VARSA şifresi eşleşiyor mu?
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result; 
    }
    return null; 
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user, 
    };
  }
}