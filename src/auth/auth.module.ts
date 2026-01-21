import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';     // Eklendi
import { PassportModule } from '@nestjs/passport'; // Eklendi

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // --- JWT AYARLARI ---
    JwtModule.register({
      secret: 'gizliAnahtar', // Şimdilik basit bir anahtar
      signOptions: { expiresIn: '60m' }, // 60 dakika geçerli
    }),
    // --------------------
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}