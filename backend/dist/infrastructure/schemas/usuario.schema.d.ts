import { Document } from 'mongoose';
export declare class Usuario extends Document {
    nombre: string;
    email: string;
    password: string;
    avatar: string;
    carnetImagen: string;
    fechaNacimiento: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
    descripcion: string;
    estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';
    rol: 'USER' | 'ADMIN' | 'SUPERADMIN';
    createdAt: Date;
}
export declare const UsuarioSchema: import("mongoose").Schema<Usuario, import("mongoose").Model<Usuario, any, any, any, Document<unknown, any, Usuario> & Usuario & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Usuario, Document<unknown, {}, import("mongoose").FlatRecord<Usuario>> & import("mongoose").FlatRecord<Usuario> & {
    _id: import("mongoose").Types.ObjectId;
}>;
