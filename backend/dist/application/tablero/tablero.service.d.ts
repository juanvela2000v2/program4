import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
import { Producto } from '../../infrastructure/schemas/producto.schema';
import { Subasta } from '../../infrastructure/schemas/subasta.schema';
import { Pago } from '../../infrastructure/schemas/pago.schema';
export declare class TableroService {
    private usuarioModel;
    private productoModel;
    private subastaModel;
    private pagoModel;
    constructor(usuarioModel: Model<Usuario>, productoModel: Model<Producto>, subastaModel: Model<Subasta>, pagoModel: Model<Pago>);
    obtenerIndicadores(): Promise<{
        usuarios: number;
        ventas: number;
        subastas: number;
        ingresos: any;
    }>;
}
