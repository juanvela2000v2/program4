import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subasta extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, enum: ['PRODUCTO', 'ROPA', 'SERVICIO', 'OTRO'] })
  categoria: 'PRODUCTO' | 'ROPA' | 'SERVICIO' | 'OTRO';

  @Prop()
  imagen: string;

  @Prop({ required: true })
  creadorId: string;

  @Prop({ required: true })
  creadorNombre: string;

  @Prop({ required: true, default: 0 })
  precioInicial: number;

  @Prop({ required: true, default: 0 })
  precioActual: number;

  @Prop({ default: 1 })
  incrementoMinimo: number;

  @Prop({ default: '' })
  pujadorActualId: string;

  @Prop({ default: '' })
  pujadorActualNombre: string;

  @Prop({ required: true })
  fechaFin: Date;

  @Prop({ required: true, default: 30 })
  duracionSegundos: number;

  @Prop({ required: true, default: 'ESPERANDO' })
  estado: 'ESPERANDO' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

  @Prop({ type: [String], default: [] })
  historialPujas: string[];
}

export const SubastaSchema = SchemaFactory.createForClass(Subasta);

@Schema({ timestamps: true })
export class Pujador extends Document {
  @Prop({ required: true })
  subastaId: string;

  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  usuarioNombre: string;

  @Prop({ required: true })
  monto: number;

  @Prop({ required: true, default: false })
  esGanador: boolean;
}

export const PujadorSchema = SchemaFactory.createForClass(Pujador);