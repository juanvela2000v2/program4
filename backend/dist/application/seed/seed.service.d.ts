import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
import { Producto } from '../../infrastructure/schemas/producto.schema';
export declare class SeedService implements OnModuleInit {
    private usuarioModel;
    private productoModel;
    constructor(usuarioModel: Model<Usuario>, productoModel: Model<Producto>);
    onModuleInit(): Promise<void>;
}
