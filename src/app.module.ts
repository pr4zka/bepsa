import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { CreateTareaUseCase } from './tareas/application/create-tarea.use.case';
import { UpdateTareaUseCase } from './tareas/application/update-tarea-status.use-case';
import { TareaRepositoryPrisma } from './tareas/infrastructure/tarea.repository.prisma';
import { ListTareasUseCase } from './tareas/application/list-tareas.use.case';
import { TareaController } from './tareas/infrastructure/tarea.controller';
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './shared/filters/http-execption.filter';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, TareaController],
  providers: [
    AppService,
    CreateTareaUseCase,
    UpdateTareaUseCase,
    ListTareasUseCase,
    TareaRepositoryPrisma,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule {}
