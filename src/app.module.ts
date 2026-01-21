import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { LoadsModule } from './loads/loads.module';
import { LoadRequestsModule } from './load-requests/load-requests.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      // 🔥 KRİTİK DEĞİŞİKLİK: Önce Environment Variable'a bak, yoksa (lokaldeysen) diğerlerini kullan
      url: process.env.DATABASE_URL, 
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'traxle_db',
      
      autoLoadEntities: true,
      synchronize: true, // Not: Canlıya geçince bunu false yapıp migration kullanmak daha güvenlidir
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Render için SSL şart
    }), 
    UsersModule, VehiclesModule, LoadsModule, LoadRequestsModule, AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}