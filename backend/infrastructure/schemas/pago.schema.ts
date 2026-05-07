import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Pago extends Document {
  @Prop({ default: '' })
  referenciaId: string;

  @Prop({ required: true })
  referenciaTipo: 'SUBASTA' | 'PRODUCTO' | 'SERVICIO';

  @Prop({ required: true })
  referenciaTitulo: string;

  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  usuarioNombre: string;

  @Prop({ required: true })
  vendedorId: string;

  @Prop({ required: true })
  vendedorNombre: string;

  @Prop({ required: true })
  monto: number;

  @Prop({ required: true, default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'PAGADO' | 'VALIDADO' | 'RECHAZADO';

  @Prop({ required: true, default: 'EFECTIVO' })
  metodoPago: 'EFECTIVO' | 'QR';

  @Prop()
  comprobante: string;

  @Prop()
  notas: string;
}

export const PagoSchema = SchemaFactory.createForClass(Pago);