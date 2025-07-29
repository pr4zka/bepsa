import { Module } from '@nestjs/common';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { CreateTareaUseCase } from './application/create-tarea.use.case';
import { ListTareasUseCase } from './application/list-tareas.use.case';
import { UpdateTareaUseCase } from './application/update-tarea-status.use-case';
import { TareaRepositoryPrisma } from './infrastructure/tarea.repository.prisma';
import { PrismaService } from '../shared/infra/prisma/prisma.service';

@Module({
  controllers: [TareasController],
  providers: [
    TareasService,
    CreateTareaUseCase,
    ListTareasUseCase,
    UpdateTareaUseCase,
    TareaRepositoryPrisma,
    PrismaService,
  ],
  exports: [TareasService],
})
export class TareasModule {}
