import {  UpdateTareaStatusData } from '../domain/tarea.repository'
import { Tarea } from '../domain/tarea.entity'
import { TareaRepositoryPrisma } from '../infrastructure/tarea.repository.prisma'
import { Injectable } from '@nestjs/common'


@Injectable()
export class UpdateTareaUseCase {
    constructor(private readonly repo: TareaRepositoryPrisma) {}

    async execute(input: UpdateTareaStatusData): Promise<Tarea> {
        const tarea = await this.repo.findById(input.id)
        if (!tarea) {
            throw new Error(`Tarea con id ${input.id} no existe`)
        }
        if (tarea.status === input.status) {
            throw new Error(`Tarea con id: ${input.id} ya tiene el estado ${input.status}`)
        }
        return this.repo.update(input)
    }
}

