import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://www.traxleapp.com', 'https://traxleapp.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔥 YENİ NESİL DEVOPS: Base64 Çözücü ile Firebase Tanrı Modu
  if (process.env.FIREBASE_BASE64) {
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_BASE64, 'base64').toString('utf8')
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(`🔥 Firebase Admin SDK (Base64) Başarıyla Bağlandı!`);
    } catch (error) {
      console.error(`❌ Firebase Başlatma Hatası (Base64 Çözülemedi):`, error);
    }
  } else {
    console.warn(`⚠️ FIREBASE_BASE64 değişkeni bulunamadı. Firebase senkronizasyonu çalışmayacak.`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Traxle Backend Motoru ${port} portunda canlıya ateşlendi!`);
}
bootstrap();