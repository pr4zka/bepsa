import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTareaUseCase } from './application/create-tarea.use.case';
import { ListTareasUseCase } from './application/list-tareas.use.case';
import { UpdateTareaUseCase } from './application/update-tarea-status.use-case';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaStatusDto } from './dto/update-tarea.dto';
import { TareaStatus } from './domain/tarea-status.enum';
import { Tarea } from './domain/tarea.entity';

@Injectable()
export class TareasService {
  constructor(
    private readonly createTareaUC: CreateTareaUseCase,
    private readonly listTareasUC: ListTareasUseCase,
    private readonly updateTareaUC: UpdateTareaUseCase,
  ) {}

  async findAll(estado?: string): Promise<Tarea[]> {
    const filtros: any = {};
    
    if (estado && Object.values(TareaStatus).includes(estado as TareaStatus)) {
      filtros.estado = estado as TareaStatus;
    }
    
    return this.listTareasUC.execute(filtros);
  }

  async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
    const createData = {
      title: createTareaDto.title,
      description: createTareaDto.description,
      fecha: createTareaDto.fecha ? new Date(createTareaDto.fecha) : undefined,
    };
    
    return this.createTareaUC.execute(createData);
  }

  async updateStatus(id: string, status: TareaStatus): Promise<Tarea> {
    try {
      const data = { id, status };
      return await this.updateTareaUC.execute(data);
    } catch (error) {
     
      if (error.message?.includes('no existe')) {
        throw new NotFoundException('Tarea no encontrada');
      }
      
      if (error.message?.includes('ya tiene el estado')) {
        throw new BadRequestException(error.message);
      }
      
      throw error;
    }
  }
}
