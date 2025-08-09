import { Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { FishService } from './fish.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateFishDto } from './dto/create_fish.dto';

@Controller('fish')
@ApiTags('Fish')
export class FishController {
  constructor(private readonly fishService: FishService) {}

  @Post()
  @ApiOperation({ summary: 'Create fish' })
  @ApiCreatedResponse()
  async createFish(@Body() fish: CreateFishDto) {
    return this.fishService.createFish(fish);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fish' })
  @ApiOkResponse()
  async getAllFish() {
    return this.fishService.getAllFish();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get fish by id' })
  @ApiOkResponse()
  async getFishById(@Param('id') id: number) {
    return this.fishService.getFishById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update fish by id' })
  @ApiOkResponse()
  async updateFish(@Param('id') id: number, @Body() fish: CreateFishDto) {
    return this.fishService.updateFish(id, fish);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete fish by id' })
  @ApiOkResponse()
  async deleteFish(@Param('id') id: number) {
    return this.fishService.deleteFish(id);
  }
}
