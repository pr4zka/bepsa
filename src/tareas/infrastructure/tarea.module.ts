import { Module } from '@nestjs/common'
import { TareaRepositoryPrisma } from './tarea.repository.prisma'
import { TareaController } from './tarea.controller'
import { CreateTareaUseCase } from '../application/create-tarea.use.case'
import { UpdateTareaUseCase } from '../application/update-tarea-status.use-case'
import { ListTareasUseCase } from '../application/list-tareas.use.case'


@Module({
    controllers: [TareaController],
    providers: [
        TareaRepositoryPrisma,
        {
            provide: CreateTareaUseCase,
            useFactory: (repo: TareaRepositoryPrisma) => new CreateTareaUseCase(repo),
            inject: [TareaRepositoryPrisma]
        },
        {
            provide: UpdateTareaUseCase,
            useFactory: (repo: TareaRepositoryPrisma) => new UpdateTareaUseCase(repo),
            inject: [TareaRepositoryPrisma]
        },
        {
            provide: ListTareasUseCase,
            useFactory: (repo: TareaRepositoryPrisma) => new ListTareasUseCase(repo),
            inject: [TareaRepositoryPrisma]
        },
    ],
})


export class TareaModule { }