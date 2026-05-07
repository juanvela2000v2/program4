import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true })
  productoId: string;

  @Prop({ required: true })
  productoTitulo: string;

  @Prop({ required: true })
  vendedorId: string;

  @Prop({ required: true })
  vendedorNombre: string;

  @Prop({ required: true })
  compradorId: string;

  @Prop({ required: true })
  compradorNombre: string;

  @Prop({ required: true, default: 'ACTIVO' })
  estado: 'ACTIVO' | 'BLOQUEADO' | 'CERRADO';
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

@Schema({ timestamps: true })
export class Mensaje extends Document {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  emisorId: string;

  @Prop({ required: true })
  emisorNombre: string;

  @Prop({ required: true })
  contenido: string;

  @Prop({ required: true, default: false })
  leido: boolean;
}

export const MensajeSchema = SchemaFactory.createForClass(Mensaje);