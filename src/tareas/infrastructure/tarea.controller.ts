import { Controller, Get, Post, Patch, Param, Query, UseGuards, Body, BadRequestException, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger'
import { CreateTareaUseCase } from '../application/create-tarea.use.case'
import { UpdateTareaUseCase } from '../application/update-tarea-status.use-case'
import { ListTareasUseCase } from '../application/list-tareas.use.case'
import { ApiKeyGuard } from '../../auth/infrastructure/api-key.guard'
import { TareaStatus } from '../domain/tarea-status.enum'
import { CreateTareaData, UpdateTareaStatusData } from '../domain/tarea.repository'
import { CreateTareaDto } from './dto/create-tarea.dto'
import { UpdateTareaStatusDto } from './dto/update-tarea.dto'

@ApiTags('tareas')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('tareas')
export class TareaController {
  constructor(
    private readonly crearUC: CreateTareaUseCase,
    private readonly actualizarUC: UpdateTareaUseCase,
    private readonly listarUC: ListTareasUseCase
  ){}

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
    async listar(@Query('estado') estado?: string) {
        const filtros: any = {}
        
        if (estado && Object.values(TareaStatus).includes(estado as TareaStatus)) {
            filtros.estado = estado as TareaStatus
        }
        
        return this.listarUC.execute(filtros)
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
    async crear(@Body() data: CreateTareaDto) {
          try {
        console.log('data', data)
        
        const createData: CreateTareaData = {
            title: data.title,
            description: data.description,
            fecha: data.fecha ? new Date(data.fecha) : undefined
        }
        
        return await this.crearUC.execute(createData);
        
    } catch (error) {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new InternalServerErrorException('Error al crear la tarea');
    }
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
    async actualizarEstado(@Param('id') id: string, @Body() body: UpdateTareaStatusDto) {
        try {
            const data: UpdateTareaStatusData = {
                id,
                status: body.status
            }
            return await this.actualizarUC.execute(data);
        } catch (error) {
            if (error.message?.includes('no existe')) {
                throw new NotFoundException('Tarea no encontrada');
            }
            
            if (error.message?.includes('ya tiene el estado')) {
                throw new BadRequestException(error.message);
            }
            
            if (error.code === 'P2025') {
                throw new NotFoundException('Tarea no encontrada');
            }
            
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new InternalServerErrorException('Error al actualizar la tarea');
        }
    }
}