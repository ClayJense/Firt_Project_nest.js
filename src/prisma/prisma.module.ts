import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Rends le service disponible partout automatiquement
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permet aux autres modules de l'utiliser
})
export class PrismaModule {}