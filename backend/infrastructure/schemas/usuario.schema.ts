import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  carnetImagen: string;

  @Prop()
  fechaNacimiento: string;

  @Prop()
  telefono: string;

  @Prop()
  direccion: string;

  @Prop()
  ciudad: string;

  @Prop()
  pais: string;

  @Prop()
  descripcion: string;

  @Prop({ required: true, default: 'PENDIENTE' })
  estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';

  @Prop({ required: true, default: 'USER' })
  rol: 'USER' | 'ADMIN' | 'SUPERADMIN';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
