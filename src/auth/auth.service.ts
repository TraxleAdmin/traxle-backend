import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin'; // 🔥 FIREBASE TANRI MODU EKLENDİ

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) { }

  // --- KAYIT OLMA FONKSİYONU (Bcrypt Entegreli) ---
  async register(createUserDto: any) {
    // 1. Rastgele 6 haneli doğrulama kodu üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔥 GÜVENLİK ZIRHI: Kullanıcının şifresini Bcrypt ile kriptola
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // 2. Kullanıcıyı oluştur (Kriptolu şifre ile)
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword, // Düz şifre yerine Hash kaydedilir
      verificationCode: code,
      isVerified: false
    });

    // 3. E-postayı gönder
    await this.mailService.sendVerificationCode(newUser.email, code);

    return {
      message: 'Kayıt başarılı! Lütfen e-postanızı kontrol edin.',
      userId: newUser.id
    };
  }

  // --- GİRİŞ KONTROL FONKSİYONU (Bcrypt Çözücü) ---
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    // Kullanıcı var mı? VARSA şifre hash'i ile eşleşiyor mu?
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // --- GİRİŞ YAPMA FONKSİYONU ---
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  // --- 🔥 ŞİFRE SIFIRLAMA MANTIĞI (Neon DB + Firebase Senkronize) ---
  async resetPassword(email: string, newPassword: string) {
    try {
      // 1. NEON DB İÇİN KRİPTOLAMA
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Neon veritabanında şifreyi güncelle
      await this.usersService.updatePassword(email, hashedPassword);
      console.log(`✅ [Neon DB] ${email} şifresi güncellendi.`);

      // 2. FIREBASE AUTH İÇİN SENKRONİZASYON
      try {
        // Eğer Firebase Admin başlatılmışsa işlemi yap
        if (admin.apps.length > 0) {
          const userRecord = await admin.auth().getUserByEmail(email);
          await admin.auth().updateUser(userRecord.uid, {
            password: newPassword, // Firebase kendi içinde hashler, düz veriyoruz
          });
          console.log(`✅ [Firebase Auth] ${email} şifresi Firebase'de senkronize edildi.`);
        } else {
          console.warn(`⚠️ [Firebase Auth] Uyarı: Firebase Admin başlatılmamış. Sadece Neon güncellendi.`);
        }
      } catch (firebaseError: any) {
        console.warn(`⚠️ [Firebase Auth] Uyarı: Kullanıcı Firebase'de bulunamadı veya güncellenemedi: ${firebaseError.message}`);
      }

      return { success: true, message: 'Şifreniz başarıyla güncellendi!' };
    } catch (error) {
      console.error('❌ Şifre Güncelleme Hatası:', error);
      throw new InternalServerErrorException('Şifre güncellenirken kritik bir hata oluştu.');
    }
  }
}