import { Controller, Delete, Param, Put } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { Post, Get } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create_user_address.dto';

@Controller('user-address')
@ApiTags('User Address')
export default class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create user address' })
  @ApiCreatedResponse()
  async createUserAddress(@Body() userAddress: CreateUserAddressDto) {
    return this.userAddressService.createUserAddress(userAddress);
  }

  @Get('/:user_id')
  @ApiOperation({ summary: 'Get user addresses' })
  @ApiOkResponse()
  async getUserAddress(@Param('user_id') user_id: string) {
    return this.userAddressService.getUserAddress(user_id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user address' })
  @ApiOkResponse()
  async deleteUserAddress(@Param('id') id: number) {
    return this.userAddressService.deleteUserAddress(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update user address' })
  @ApiOkResponse()
  async updateUserAddress(
    @Param('id') id: number,
    @Body() userAddress: CreateUserAddressDto,
  ) {
    return this.userAddressService.updateUserAddress(id, userAddress);
  }
}
