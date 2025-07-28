import { CreateTareaData } from '../domain/tarea.repository'
import { Tarea } from '../domain/tarea.entity' 
import { TareaRepositoryPrisma } from '../infrastructure/tarea.repository.prisma'
import { Injectable } from '@nestjs/common'


@Injectable()
export class CreateTareaUseCase {
    constructor(private readonly repo: TareaRepositoryPrisma){}

    async execute(input: CreateTareaData): Promise<Tarea> {
        return this.repo.create(input)
    }
}