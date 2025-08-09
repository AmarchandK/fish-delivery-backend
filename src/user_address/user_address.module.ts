import { Module } from '@nestjs/common';
import UserAddressController from './user_address.controller';
import { UserAddressService } from './user_address.service';
import { UserAddress } from './entity/user_address_entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
