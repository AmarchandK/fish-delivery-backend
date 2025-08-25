import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateFish } from 'src/entities/create_fish.entity';
import { ProductImages } from 'src/entities/product_images.entity';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreateFish, ProductImages]),
    CategoryModule,
  ],
  controllers: [FishController],
  providers: [FishService],
  exports: [FishService],
})
export class FishModule {}
