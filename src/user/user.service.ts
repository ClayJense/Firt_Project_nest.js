/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type UserResponse = {
  id: string;
  name: string;
  email: string;
  age: number;
};

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  age: number;
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(): Promise<UserResponse[]> {
    const users = (await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    })) as UserResponse[];
    return users;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = (await this.prismaService.user.create({
      data: createUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    })) as UserResponse;
    return user;
  }
}
