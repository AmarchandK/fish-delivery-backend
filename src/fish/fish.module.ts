import { Module } from '@nestjs/common';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateFish } from '../entities/create_fish.entity';
import { ProductImages } from 'src/entities/product_images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreateFish, ProductImages])],
  controllers: [FishController],
  providers: [FishService],
})
export class FishModule {}
