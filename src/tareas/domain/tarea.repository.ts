import { Tarea } from './tarea.entity'
import { TareaStatus } from './tarea-status.enum'

export interface CreateTareaData {
    title: string;
    description: string;
    fecha?: Date;
}

export interface UpdateTareaStatusData {
    id: string;
    status: TareaStatus;
}

export interface Filtros {
    estado?: TareaStatus;
}

export interface TareaRepository {
    findAll(filtro?: Filtros): Promise<Tarea[]>
    findById(id: number): Promise<Tarea | null>
    create(data: CreateTareaData): Promise<Tarea>
    update(tarea: UpdateTareaStatusData): Promise<Tarea>
    delete(id: number): Promise<void>
}