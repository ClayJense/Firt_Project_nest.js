import { UserService } from './user.service.js';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any[]> {
    return this.userService.getUsers();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.register(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<any> {
    return this.userService.getUserById(id);
  }
}
