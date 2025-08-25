import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create_user_address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from 'src/entities/user_address_entity';
import { errorResponse, successResponse } from 'src/common/responses';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}
  async createUserAddress(userAddress: CreateUserAddressDto) {
    try {
      const createdUserAddress = await this.userAddressRepository.save({
        address: userAddress.address,
        city: userAddress.city,
        state: userAddress.state,
        country: userAddress.country,
        pincode: userAddress.pincode,
        user_id: userAddress.user_id,
        mobile: userAddress.mobile,
      });
      return successResponse(
        createdUserAddress,
        'User address created successfully',
        201,
      );
    } catch (error) {
      console.error('Error creating user address', error);
      return errorResponse(error, 'Error creating user address', 500);
    }
  }

  async getUserAddress(user_id: string) {
    try {
      const userAddress = await this.userAddressRepository.find({
        where: { user_id, deleteFlag: false },
      });
      if (userAddress.length > 0) {
        return successResponse(
          userAddress,
          'User address fetched successfully',
          200,
        );
      }
      return errorResponse(userAddress, 'User address not found', 404);
    } catch (error) {
      console.error('Error getting user address', error);
      return errorResponse(error, 'Error getting user address', 500);
    }
  }

  async updateUserAddress(id: number, userAddress: CreateUserAddressDto) {
    try {
      const updatedUserAddress = await this.userAddressRepository.update(
        id,
        userAddress,
      );
      if (updatedUserAddress) {
        return successResponse(
          updatedUserAddress,
          'User address updated successfully',
          200,
        );
      }
      return errorResponse(updatedUserAddress, 'User address not found', 404);
    } catch (error) {
      console.error('Error updating user address', error);
      return errorResponse(error, 'Error updating user address', 500);
    }
  }

  async deleteUserAddress(id: number) {
    try {
      const deletedUserAddress = await this.userAddressRepository.delete(id);
      if (deletedUserAddress) {
        return successResponse(
          deletedUserAddress,
          'User address deleted successfully',
          200,
        );
      }
      return errorResponse(deletedUserAddress, 'User address not found', 404);
    } catch (error) {
      console.error('Error deleting user address', error);
      return errorResponse(error, 'Error deleting user address', 500);
    }
  }
}
