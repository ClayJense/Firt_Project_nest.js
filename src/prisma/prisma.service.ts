import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMysql2 } from '@prisma/adapter-mysql2'; // Note le 2
import mysql from 'mysql2/promise';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Création du pool de connexion MySQL
    const pool = mysql.createPool(process.env.DATABASE_URL!);
    const adapter = new PrismaMysql2(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}