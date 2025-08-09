import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishModule } from './fish/fish.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserAddressModule } from './user_address/user_address.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Use only in dev!
    }),
    JwtModule.register({
      secret: process.env.JWT_BASE_SECRET,
    }),
    AuthModule,
    FishModule,
    OrderModule,
    UserModule,
    UserAddressModule,
  ],
})
export class AppModule {}
