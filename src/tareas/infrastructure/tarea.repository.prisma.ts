import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/infra/prisma/prisma.service'
import { CreateTareaData, TareaRepository, Filtros, UpdateTareaStatusData } from '../domain/tarea.repository'
import { Tarea } from '../domain/tarea.entity'

@Injectable() 
export class TareaRepositoryPrisma implements TareaRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(filtro?: Filtros): Promise<Tarea[]> {
        const where: any = {}
        
        if (filtro?.estado) {
            where.status = filtro.estado
        }

        const tasks = await this.prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return tasks.map(task => new Tarea(
            task.id,
            task.title,
            task.description,
            task.status as any,
            task.completed,
            task.fecha,
            task.createdAt,
            task.updatedAt
        ))
    }

    async findById(id: string): Promise<Tarea | null> {
        const task = await this.prisma.task.findUnique({
            where: { id: id }
        })

        if (!task) return null

        return new Tarea(
            task.id,
            task.title,
            task.description,
            task.status as any,
            task.completed,
            task.fecha,
            task.createdAt,
            task.updatedAt
        )
    }

    async create(data: CreateTareaData): Promise<Tarea> {
        const task = await this.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                fecha: data.fecha || new Date()
            }
        })

        return new Tarea(
            task.id,
            task.title,
            task.description,
            task.status as any,
            task.completed,
            task.fecha,
            task.createdAt,
            task.updatedAt
        )
    }

    async update(data: UpdateTareaStatusData): Promise<Tarea> {
        const task = await this.prisma.task.update({
            where: { id: data.id },
            data: { 
                status: data.status,
                completed: data.status === 'COMPLETADA' ? true : false
             }
        })

        return new Tarea(
            task.id,
            task.title,
            task.description,
            task.status as any,
            task.completed,
            task.fecha,
            task.createdAt,
            task.updatedAt
        )
    }

    async delete(id: string): Promise<void> {
        await this.prisma.task.delete({
            where: { id: id }
        })
    }
}