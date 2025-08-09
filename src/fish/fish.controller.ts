import { Controller } from '@nestjs/common';
import { FishService } from './fish.service';

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {}
}
