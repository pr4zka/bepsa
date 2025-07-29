import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTareaDto {
  @ApiProperty({ example: 'Completar proyecto' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es requerido y no puede estar vacío' })
  title: string;

  @ApiProperty({ example: 'Finalizar la implementación de la API' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es requerida y no puede estar vacía' })
  description: string;

  @ApiProperty({ 
    example: '2025-12-31T23:59:59Z',
    required: false,
    description: 'Fecha de vencimiento (opcional)' 
  })
  @IsDateString()
  fecha?: string;
}
