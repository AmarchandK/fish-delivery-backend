import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse()
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by firebaseUid' })
  @ApiOkResponse({ type: User })
  async getUser(@Param('id') firebaseUid: string) {
    return this.userService.getUser(firebaseUid);
  }
  // update user
  @Put(':id')
  @ApiOperation({ summary: 'Update user by firebaseUid' })
  @ApiOkResponse({ type: User })
  async updateUser(
    @Param('id') firebaseUid: string,
    @Body() user: CreateUserDto,
  ) {
    return this.userService.updateUser(firebaseUid, user);
  }
  //logout user
  @Delete(':id')
  @ApiOperation({ summary: 'Logout user by firebaseUid' })
  @ApiOkResponse({ type: User })
  async logoutUser(@Param('id') firebaseUid: string) {
    return this.userService.logoutUser(firebaseUid);
  }
}
