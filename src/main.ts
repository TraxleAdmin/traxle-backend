import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 MİMARİ ZIRH: Vercel'deki web sitemizin (ve test için localhost'un) API'ye erişim kilidini açıyoruz.
  app.enableCors({
    origin: ['https://www.traxleapp.com', 'https://traxleapp.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔥 BULUT UYUMU: Render.com'un atadığı dinamik portu dinle, yoksa 3000'de çalış.
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Traxle Backend Motoru ${port} portunda canlıya ateşlendi!`);
}
bootstrap();