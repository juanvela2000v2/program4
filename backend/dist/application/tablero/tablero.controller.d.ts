import { TableroService } from './tablero.service';
export declare class TableroController {
    private readonly tableroService;
    constructor(tableroService: TableroService);
    indicadores(): Promise<{
        usuarios: number;
        ventas: number;
        subastas: number;
        ingresos: any;
    }>;
}
