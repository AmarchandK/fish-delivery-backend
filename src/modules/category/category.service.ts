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
      return successResponse(result, 'Category created successfully', 201);
    } catch (error) {
      console.error('Error creating category', error);
      return errorResponse(error, 'Error creating category', 500);
    }
  }

  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['fishes'],
      });
      return successResponse(
        categories,
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
        where: { id },
        relations: ['fishes'],
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return successResponse(category, 'Category fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching category', error);
      return errorResponse(error, 'Error fetching category', 500);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    try {
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
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return successResponse(result, 'Category deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting category', error);
      return errorResponse(error, 'Error deleting category', 500);
    }
  }
}
