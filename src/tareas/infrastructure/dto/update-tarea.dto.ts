import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TareaStatus } from '../../domain/tarea-status.enum';

export class UpdateTareaStatusDto {
    @ApiProperty({
        enum: TareaStatus,
        example: TareaStatus.COMPLETADA
    })
    @IsEnum(TareaStatus, {
        message: 'Status debe ser uno de: PENDIENTE, EN_PROGRESO, COMPLETADA'
    })
    status: TareaStatus;
}