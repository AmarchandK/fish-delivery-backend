import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFish } from '../../entities/create_fish.entity';
import { Repository } from 'typeorm';
import { CreateFishDto } from './dto/create_fish.dto';
import { errorResponse, successResponse } from 'src/common/responses';
import { ProductImages } from 'src/entities/product_images.entity';
import { UpdateFishDto } from './dto/update-fish.dto';

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
        delete_flag: false,
        category_id: fish.categoryId,
      });
      if (fish.productImages && fish.productImages.length > 0) {
        const productImages = fish.productImages.map((image) => ({
          create_fish_id: createdFish.id,
          image,
          delete_flag: false,
        }));
        const savedImages =
          await this.productImagesRepository.save(productImages);
        createdFish.product_images = savedImages;
      }
      await this.fishRepository.save(createdFish);
      if (createdFish) {
        const res = {
          id: createdFish.id,
          name: createdFish.name,
          price: createdFish.price,
          description: createdFish.description,
          product_images: createdFish.product_images.map(
            (image) => image.image,
          ),
          category_id: createdFish.category_id,
        };
        return successResponse(res, 'Fish created successfully', 201);
      }
      return errorResponse(createdFish, 'Fish not created', 400);
    } catch (error) {
      console.error('Error creating fish', error);
      return errorResponse(error, 'Error creating fish', 500);
    }
  }

  async getAllFish() {
    try {
      const fish = await this.fishRepository
        .createQueryBuilder('fish')
        .select([
          'fish.id',
          'fish.name',
          'fish.price',
          'fish.description',
          'fish.category_id',
          'fish.category',
        ])
        .where('fish.delete_flag = :delete_flag', { delete_flag: false })
        .leftJoinAndSelect('fish.product_images', 'product_images')
        .leftJoinAndSelect('fish.category', 'category')
        .getMany();
      if (fish) {
        const res = fish.map((fish) => {
          return {
            id: fish.id,
            name: fish.name,
            price: fish.price,
            description: fish.description,
            product_images: fish.product_images.map((image) => image.image),
            category_id: fish.category_id,
            category_name: fish.category.name,
          };
        });
        return successResponse(res, 'Fish fetched successfully', 200);
      }
      return errorResponse(fish, 'Fish not found', 404);
    } catch (error) {
      console.error('Error getting fish', error);
      return errorResponse(error, 'Error getting fish', 500);
    }
  }

  async getFishById(id: number) {
    try {
      const fish = await this.fishRepository
        .createQueryBuilder('fish')
        .select([
          'fish.id',
          'fish.name',
          'fish.price',
          'fish.description',
          'fish.category_id',
          'category',
        ])
        .where('fish.id = :id', { id })
        .andWhere('fish.delete_flag = :delete_flag', { delete_flag: false })
        .leftJoinAndSelect('fish.product_images', 'product_images')
        .leftJoinAndSelect('fish.category', 'category')
        .getOne();
      if (fish) {
        const res = {
          id: fish.id,
          name: fish.name,
          price: fish.price,
          description: fish.description,
          product_images: fish.product_images.map((image) => image.image),
          category_id: fish.category_id,
          category_name: fish.category.name,
        };
        return successResponse(res, 'Fish fetched successfully', 200);
      }
      return errorResponse(fish, 'Fish not found', 404);
    } catch (error) {
      console.error('Error getting fish', error);
      return errorResponse(error, 'Error getting fish', 500);
    }
  }

  async updateFish(id: number, fishDto: UpdateFishDto) {
    try {
      const updatedFish = await this.fishRepository.findOne({
        where: { id, delete_flag: false },
        relations: ['product_images', 'category'],
      });
      if (!updatedFish) {
        return errorResponse(null, 'Fish not found', 404);
      }
      await this.fishRepository.update(id, {
        name: fishDto.name,
        price: fishDto.price,
        description: fishDto.description,
        delete_flag: false,
      });
      // check images update if its same
      if (updatedFish.product_images.length > 0) {
        for (let i = 0; i < updatedFish.product_images.length; i++) {
          await this.productImagesRepository.delete(
            updatedFish.product_images[i].id,
          );
        }
      }
      if (fishDto.productImages && fishDto.productImages.length > 0) {
        const productImages = fishDto.productImages.map((image) => ({
          create_fish_id: id,
          image,
          delete_flag: false,
        }));
        const savedImages =
          await this.productImagesRepository.save(productImages);
        updatedFish.product_images = savedImages;
      }
      await this.fishRepository.save(updatedFish);
      if (updatedFish) {
        const res = {
          id: updatedFish.id,
          name: updatedFish.name,
          price: updatedFish.price,
          description: updatedFish.description,
          product_images: updatedFish.product_images.map(
            (image) => image.image,
          ),
          category_id: updatedFish.category_id,
          category_name: updatedFish.category.name,
        };
        return successResponse(res, 'Fish updated successfully', 200);
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
        relations: ['product_images'],
      });

      if (!fishToDelete) {
        return errorResponse(null, 'Fish not found', 404);
      }

      // Delete associated product images first
      if (fishToDelete.product_images.length > 0) {
        const imageIds = fishToDelete.product_images.map((img) => img.id);
        await this.productImagesRepository.delete(imageIds);
      }

      // Now delete the fish
      await this.fishRepository.delete(id);

      return successResponse(null, 'Fish deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting fish', error);
      return errorResponse(error, 'Error deleting fish', 500);
    }
  }

  async getFishByCategory(categoryId: string) {
    try {
      const fish = await this.fishRepository.find({
        select: [
          'id',
          'name',
          'price',
          'description',
          'category_id',
          'category',
        ],
        where: { category_id: categoryId, delete_flag: false },
        relations: ['product_images', 'category'],
      });

      if (!fish || fish.length == 0) {
        return errorResponse(fish, 'Fishes not found', 404);
      }

      const res = fish.map((fish) => {
        return {
          id: fish.id,
          name: fish.name,
          price: fish.price,
          description: fish.description,
          product_images: fish.product_images.map((image) => image.image),
          category_id: fish.category_id,
          category_name: fish.category.name,
        };
      });
      return successResponse(res, 'Fishes fetched successfully', 200);
    } catch (error) {
      console.error('Error getting fish by category', error);
      return errorResponse(error, 'Error getting fish by category', 500);
    }
  }
}
