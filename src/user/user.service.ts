import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

type UserResponse = {
  id: string;
  name: string;
  email: string;
  age: number;
};


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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    const user = (await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    })) as UserResponse;
    return user;
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = (await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
      },
    })) as UserResponse | null;
    return user;
  }
}
