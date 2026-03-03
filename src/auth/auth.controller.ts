import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service'; // 👈 EKLENDİ

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService // 👈 EKLENDİ
  ) { }

  @Post('login')
  async login(@Body() req: any) {
    const validUser = await this.authService.validateUser(req.email, req.password);

    if (!validUser) {
      throw new UnauthorizedException('E-posta veya şifre hatalı!');
    }

    return this.authService.login(validUser);
  }

  // --- 🔥 YENİ EKLENEN: ŞİFRE SIFIRLAMA API'Sİ ---
  // Web sitesinden (Frontend) gelen şifre değiştirme talebini burası karşılar.
  @Post('reset-password')
  async resetPassword(@Body() req: { email: string; newPassword: string }) {
    await this.usersService.updatePassword(req.email, req.newPassword);
    return { message: 'Şifre başarıyla güncellendi!' };
  }
}