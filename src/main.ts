import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin'; // 🔥 FIREBASE ADMIN EKLENDİ

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://www.traxleapp.com', 'https://traxleapp.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔥 FIREBASE TANRI MODU BAŞLATILIYOR (Sistemin her yerinden erişilebilir)
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // .env'den gelen \n karakterlerini gerçek alt satıra çeviriyoruz
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log(`🔥 Firebase Admin SDK Başarıyla Bağlandı!`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Traxle Backend Motoru ${port} portunda canlıya ateşlendi!`);
}
bootstrap();