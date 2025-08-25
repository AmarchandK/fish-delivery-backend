import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FishService } from './fish.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFishDto } from './dto/update-fish.dto';
import { CreateFishDto } from './dto/create_fish.dto';
import { CreateFish } from 'src/entities/create_fish.entity';

@Controller('fishes')
@ApiTags('Fishes')
export class FishController {
  constructor(private readonly fishService: FishService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fish' })
  @ApiResponse({
    status: 201,
    description: 'The fish has been successfully created.',
    type: CreateFishDto,
  })
  async create(@Body() createFishDto: CreateFishDto) {
    return this.fishService.createFish(createFishDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fishes' })
  @ApiResponse({
    status: 200,
    description: 'Return all fishes.',
    type: [CreateFish],
  })
  async findAll() {
    return this.fishService.getAllFish();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fish by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the fish.',
    type: CreateFish,
  })
  @ApiResponse({ status: 404, description: 'Fish not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.getFishById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a fish' })
  @ApiResponse({
    status: 200,
    description: 'The fish has been successfully updated.',
    type: CreateFish,
  })
  @ApiResponse({ status: 404, description: 'Fish not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFishDto: UpdateFishDto,
  ) {
    return this.fishService.updateFish(id, updateFishDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fish' })
  @ApiResponse({
    status: 200,
    description: 'The fish has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Fish not found.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.deleteFish(id);
  }
}
