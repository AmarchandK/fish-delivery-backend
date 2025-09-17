import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { errorResponse, successResponse } from 'src/common/responses';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      let result = await this.categoryRepository.save(category);
      const res = {
        id: result.id,
        name: result.name,
        description: result.description,
      };
      return successResponse(res, 'Category created successfully', 201);
    } catch (error) {
      console.error('Error creating category', error);
      return errorResponse(error, 'Error creating category', 500);
    }
  }

  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryRepository.find({
        select: ['id', 'name', 'description'],
        where: { delete_flag: false, is_active: true },
      });
      const res = categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      }));
      return successResponse(
        res,
        'Categories fetched successfully',
        200,
      );
    } catch (error) {
      console.error('Error fetching categories', error);
      return errorResponse(error, 'Error fetching categories', 500);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        select: ['id', 'name', 'description', 'fishes'],
        where: { id, delete_flag: false, is_active: true },
        relations: ['fishes', 'fishes.product_images', 'fishes.category'],
      });
      if (!category) {
        return errorResponse(null, `Category with ID ${id} not found`, 404);
      }
      const res = {
        id: category.id,
        name: category.name,
        description: category.description,
        fishes: category.fishes?.map((fish) => ({
          id: fish.id,
          name: fish.name,
          price: fish.price,
          description: fish.description,
          product_images: fish.product_images?.map((image) => image.image),
        })),
      };
      return successResponse(res, 'Category fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching category', error);
      return errorResponse(error, 'Error fetching category', 500);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!category) {
        return errorResponse(null, `Category with ID ${id} not found`, 404);
      }
      const updatedCategory = await this.categoryRepository.update(id, {
        ...updateCategoryDto,
      });
      return successResponse(
        updatedCategory,
        'Category updated successfully',
        200,
      );
    } catch (error) {
      console.error('Error updating category', error);
      return errorResponse(error, 'Error updating category', 500);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!category) {
        return errorResponse(null, `Category with ID ${id} not found`, 404);
      }
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        return errorResponse(null, `Category with ID ${id} not found`, 404);
      }
      return successResponse(null, 'Category deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting category', error);
      return errorResponse(error, 'Error deleting category', 500);
    }
  }
}
