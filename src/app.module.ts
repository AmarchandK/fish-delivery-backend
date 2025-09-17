import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishModule } from './modules/fish/fish.module';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserAddressModule } from './modules/user_address/user_address.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
      },
    }),
    AuthModule,
    FishModule,
    OrderModule,
    UserModule,
    UserAddressModule,
  ],
})
export class AppModule {}
