import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { errorResponse, successResponse } from 'src/common/responses';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const createdUser = await this.userRepository.save({
        name: user.name,
        firebase_uid: user.firebaseUid,
        phone: user.phone,
        is_logged_in: true,
        delete_flag: false,
      });
      return successResponse(createdUser, 'User created successfully', 201);
    } catch (error) {
      console.error('Error creating user', error);
      return errorResponse(error, 'Error creating user', 500);
    }
  }

  async getUser(firebaseUid: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { firebase_uid: firebaseUid, delete_flag: false },
      });
      if (!user) {
        return errorResponse(user, 'User not found', 404);
      }
      return successResponse(user, 'User fetched successfully', 200);
    } catch (error) {
      console.error('Error getting user', error);
      return errorResponse(error, 'Error getting user', 500);
    }
  }

  async updateUser(firebaseUid: string, user: CreateUserDto) {
    try {
      const updatedUser = await this.userRepository.update(
        { firebase_uid: firebaseUid, delete_flag: false },
        user,
      );
      if (updatedUser) {
        return successResponse(updatedUser, 'User updated successfully', 200);
      }
      return errorResponse(updatedUser, 'User not found', 404);
    } catch (error) {
      console.error('Error updating user', error);
      return errorResponse(error, 'Error updating user', 500);
    }
  }

  async logoutUser(firebaseUid: string) {
    try {
      const updatedUser = await this.userRepository.update(
        { firebase_uid: firebaseUid, delete_flag: false },
        { is_logged_in: false },
      );
      if (updatedUser) {
        return successResponse(
          updatedUser,
          'User logged out successfully',
          200,
        );
      }
      return errorResponse(updatedUser, 'User not found', 404);
    } catch (error) {
      console.error('Error logging out user', error);
      return errorResponse(error, 'Error logging out user', 500);
    }
  }
}
