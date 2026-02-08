import { UserService } from './user.service.js';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any[]> {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: any): Promise<any> {
    return this.userService.createUser(createUserDto);
  }
}
