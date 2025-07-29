import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { TareasModule } from './tareas/tareas.module';
import { APP_FILTER } from '@nestjs/core'
import { AllExceptionsFilter } from './shared/filters/http-execption.filter';

@Module({
  imports: [PrismaModule, TareasModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule {}
