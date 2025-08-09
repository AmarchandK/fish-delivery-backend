import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFish } from '../entities/create_fish.entity';
import { Repository } from 'typeorm';
import { CreateFishDto } from './dto/create_fish.dto';
import { errorResponse, successResponse } from 'src/common/responses';
import { ProductImages } from 'src/entities/product_images.entity';

@Injectable()
export class FishService {
  constructor(
    @InjectRepository(CreateFish)
    private fishRepository: Repository<CreateFish>,
    @InjectRepository(ProductImages)
    private productImagesRepository: Repository<ProductImages>,
  ) {}

  async createFish(fish: CreateFishDto) {
    try {
      let createdFish = await this.fishRepository.save({
        name: fish.name,
        price: fish.price,
        description: fish.description,
        deleteFlag: false,
      });
      for (let i = 0; i < fish.images.length; i++) {
        const productImages = await this.productImagesRepository.save({
          create_fish_id: createdFish.id,
          image: fish.images[i],
          deleteFlag: false,
        });
        createdFish.productImages.push(productImages);
      }
      await this.fishRepository.save(createdFish);
      if (createdFish) {
        return successResponse(createdFish, 'Fish created successfully', 201);
      }
      return errorResponse(createdFish, 'Fish not created', 400);
    } catch (error) {
      console.error('Error creating fish', error);
      return errorResponse(error, 'Error creating fish', 500);
    }
  }

  async getAllFish() {
    try {
      const fish = await this.fishRepository.find({
        where: { deleteFlag: false },
        relations: ['productImages'],
      });
      if (fish) {
        return successResponse(fish, 'Fish fetched successfully', 200);
      }
      return errorResponse(fish, 'Fish not found', 404);
    } catch (error) {
      console.error('Error getting fish', error);
      return errorResponse(error, 'Error getting fish', 500);
    }
  }

  async getFishById(id: number) {
    try {
      const fish = await this.fishRepository.findOne({
        where: { id, deleteFlag: false },
        relations: ['productImages'],
      });
      if (fish) {
        return successResponse(fish, 'Fish fetched successfully', 200);
      }
      return errorResponse(fish, 'Fish not found', 404);
    } catch (error) {
      console.error('Error getting fish', error);
      return errorResponse(error, 'Error getting fish', 500);
    }
  }

  async updateFish(id: number, fish: CreateFishDto) {
    try {
      const updatedFish = await this.fishRepository.save({
        id,
        name: fish.name,
        price: fish.price,
        description: fish.description,
        deleteFlag: false,
      });
      // check images update if its same
      if (updatedFish.productImages.length > 0) {
        for (let i = 0; i < updatedFish.productImages.length; i++) {
          await this.productImagesRepository.delete(
            updatedFish.productImages[i].id,
          );
        }
      }
      updatedFish.productImages = [];
      if (fish.images) {
        for (let i = 0; i < fish.images.length; i++) {
          const productImages = await this.productImagesRepository.save({
            create_fish_id: id,
            image: fish.images[i],
            deleteFlag: false,
          });
          updatedFish.productImages.push(productImages);
        }
      }
      if (updatedFish) {
        return successResponse(updatedFish, 'Fish updated successfully', 200);
      }
      return errorResponse(updatedFish, 'Fish not found', 404);
    } catch (error) {
      console.error('Error updating fish', error);
      return errorResponse(error, 'Error updating fish', 500);
    }
  }

  async deleteFish(id: number) {
    try {
      const fishToDelete = await this.fishRepository.findOne({
        where: { id },
        relations: ['productImages'],
      });

      if (!fishToDelete) {
        throw new Error('Fish not found');
      }

      // Delete associated product images first
      if (fishToDelete.productImages.length > 0) {
        for (let i = 0; i < fishToDelete.productImages.length; i++) {
          await this.productImagesRepository.delete(
            fishToDelete.productImages[i].id,
          );
        }
      }

      // Now delete the fish
      await this.fishRepository.delete(id);

      return successResponse(fishToDelete, 'Fish deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting fish', error);
      return errorResponse(error, 'Error deleting fish', 500);
    }
  }
}
