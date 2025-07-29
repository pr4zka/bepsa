import {  UpdateTareaStatusData } from '../domain/tarea.repository'
import { Tarea } from '../domain/tarea.entity'
import { TareaRepositoryPrisma } from '../infrastructure/tarea.repository.prisma'
import { Injectable } from '@nestjs/common'


@Injectable()
export class UpdateTareaUseCase {
    constructor(private readonly repo: TareaRepositoryPrisma) {}

    async execute(input: UpdateTareaStatusData): Promise<Tarea> {
        return this.repo.update(input)
    }
}

