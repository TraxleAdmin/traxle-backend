import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: any) {
    // 1. ÖNCE KİMLİK KONTROLÜ YAP
    const validUser = await this.authService.validateUser(req.email, req.password);

    // 2. EĞER KULLANICI YOKSA VEYA ŞİFRE YANLIŞSA HATA FIRLAT
    if (!validUser) {
      throw new UnauthorizedException('E-posta veya şifre hatalı!');
    }

    // 3. SADECE DOĞRUYSA GİRİŞ YAP VE TOKEN VER
    return this.authService.login(validUser);
  }
}