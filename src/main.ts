import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 TAM GÜVENLİK MODU (PRODUCTION READY)
  app.enableCors({
    origin: [
      'https://www.traxleapp.com',    // 1. Canlı Siten (Ana Kapı)
      'https://traxleapp.com',        // 2. www'siz versiyon
      'http://localhost:3000',        // 3. Web Geliştirme (Senin PC)
      'http://localhost:8081',        // 4. Mobil Emülatörler (Genelde bu portu kullanır)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Çerez/Token gönderimine izin ver
  });

  // Render veya Yerel Portu dinle
  await app.listen(process.env.PORT || 3000);
}
bootstrap();