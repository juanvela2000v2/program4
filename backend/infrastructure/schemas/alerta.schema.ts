import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Alerta extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ required: true, default: 'INFO' })
  tipo: 'INFO' | 'ADVERTENCIA' | 'URGENTE' | 'EMERGENCIA';

  @Prop({ required: true, default: 'MEDIA' })
  urgency: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

  @Prop({ required: true, default: true })
  activa: boolean;

  @Prop()
  creadorId: string;

  @Prop()
  creadorNombre: string;

  @Prop({ type: [String], default: [] })
  leidaPor: string[];
}

export const AlertaSchema = SchemaFactory.createForClass(Alerta);
