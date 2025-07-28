import { Filtros } from '../domain/tarea.repository'
import { Tarea } from '../domain/tarea.entity'
import { TareaRepositoryPrisma } from '../infrastructure/tarea.repository.prisma'
import { Injectable } from '@nestjs/common'


@Injectable()
export class ListTareasUseCase {
    constructor(private readonly repo: TareaRepositoryPrisma) {}

    async execute(filtros?: Filtros): Promise<Tarea[]> {
        return this.repo.findAll(filtros)
    }
}