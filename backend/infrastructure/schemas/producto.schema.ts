import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Producto extends Document {
  @Prop({ required: true })
  usuarioId: string;

  @Prop()
  vendedorNombre: string;

  @Prop()
  vendedorAvatar: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true, default: 'ACTIVO' })
  estado: 'ACTIVO' | 'VENDIDO' | 'INACTIVO';

  @Prop({ required: true, default: false })
  validado: boolean;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
