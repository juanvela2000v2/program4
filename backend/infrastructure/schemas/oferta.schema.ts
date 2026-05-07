import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Oferta extends Document {
  @Prop({ required: true })
  subastaId: string;

  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  monto: number;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const OfertaSchema = SchemaFactory.createForClass(Oferta);
