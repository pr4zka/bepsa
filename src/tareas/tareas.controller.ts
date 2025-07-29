import { Controller, Get, Post, Patch, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaStatusDto } from './dto/update-tarea.dto';
import { ApiKeyGuard } from '../auth/infrastructure/api-key.guard';
import { TareaStatus } from './domain/tarea-status.enum';

@ApiTags('tareas')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar tareas', 
    description: 'Obtiene una lista de todas las tareas con filtros opcionales' 
  })
  @ApiQuery({ 
    name: 'estado', 
    required: false, 
    enum: TareaStatus,
    description: 'Filtrar tareas por estado' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tareas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] },
          completed: { type: 'boolean' },
          fecha: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'API Key inválida o faltante' })
  async findAll(@Query('estado') estado?: string) {
    return this.tareasService.findAll(estado);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva tarea', 
    description: 'Crea una nueva tarea en el sistema' 
  })
  @ApiBody({
    description: 'Datos para crear una nueva tarea',
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string', example: 'Completar proyecto' },
        description: { type: 'string', example: 'Finalizar la implementación de la API' },
        fecha: { 
          type: 'string', 
          format: 'date-time', 
          example: '2025-12-31T23:59:59Z',
          description: 'Fecha de vencimiento (opcional, por defecto fecha actual)' 
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarea creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { enum: ['PENDIENTE'] },
        completed: { type: 'boolean', example: false },
        fecha: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'API Key inválida o faltante' })
  async create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Actualizar estado de tarea', 
    description: 'Actualiza el estado de una tarea específica' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la tarea',
    example: 'clr1k2j3k4l5m6n7o8p9' 
  })
  @ApiBody({
    description: 'Nuevo estado de la tarea',
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { 
          enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'],
          example: 'COMPLETADA'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de la tarea actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        status: { enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] },
        completed: { type: 'boolean' },
        fecha: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 401, description: 'API Key inválida o faltante' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  async updateStatus(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaStatusDto) {
    return this.tareasService.updateStatus(id, updateTareaDto.status);
  }
}
