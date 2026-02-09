import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type UserResponse = {
  id: string;
  name: string;
  email: string;
  age: number;
};

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async register(createUserDto: CreateUserDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.prismaService.user.create({
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
    });

    // Générer un token pour l'utilisateur nouvellement inscrit
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
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
