import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Servicio extends Document {
  @Prop({ required: true })
  usuarioId: string;

  @Prop()
  proveedorNombre: string;

  @Prop()
  proveedorAvatar: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, enum: ['OFRECER', 'BUSCAR'] })
  tipo: 'OFRECER' | 'BUSCAR';

  @Prop({ required: true })
  categoria: string; // albañil, plomero, arquitecto, etc.

  @Prop()
  precio?: number; // opcional para servicios

  @Prop({ required: true, default: 'ACTIVO' })
  estado: 'ACTIVO' | 'COMPLETADO' | 'INACTIVO';

  @Prop({ required: true, default: false })
  validado: boolean;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ServicioSchema = SchemaFactory.createForClass(Servicio);