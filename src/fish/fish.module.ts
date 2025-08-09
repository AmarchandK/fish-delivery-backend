import { Module } from '@nestjs/common';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';

@Module({
  controllers: [FishController],
  providers: [FishService],
})
export class FishModule {}
