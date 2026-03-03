import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() req: any) {
    if (!req.email || !req.password) {
      throw new BadRequestException('E-posta ve şifre alanları zorunludur.');
    }

    const validUser = await this.authService.validateUser(req.email, req.password);

    if (!validUser) {
      throw new UnauthorizedException('E-posta veya şifre hatalı!');
    }

    return this.authService.login(validUser);
  }

  // --- 🔥 ŞİFRE SIFIRLAMA API'Sİ ---
  @Post('reset-password')
  async resetPassword(@Body() req: { email: string; newPassword: string }) {
    if (!req.email || !req.newPassword) {
      throw new BadRequestException('E-posta ve yeni şifre alanları zorunludur.');
    }

    // İşlemi doğrudan AuthService'deki güvenli metoda devrediyoruz
    const result = await this.authService.resetPassword(req.email, req.newPassword);
    return { message: result.message };
  }
}