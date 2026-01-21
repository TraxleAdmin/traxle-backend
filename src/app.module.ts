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
    ConfigModule.forRoot(), // .env dosyası okumak için
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Varsayılan kullanıcı
      password: 'admin', // <-- DİKKAT: Kendi şifreni buraya yaz!
      database: 'traxle_db',
      autoLoadEntities: true,
      synchronize: true, // Üretimde false olmalı, verileri kaybetmemek için kapalı tutuyoruz
    }), UsersModule, VehiclesModule, LoadsModule, LoadRequestsModule, AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}