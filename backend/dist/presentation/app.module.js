"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const autenticacion_controller_1 = require("../application/autenticacion/autenticacion.controller");
const autenticacion_service_1 = require("../application/autenticacion/autenticacion.service");
const usuarios_controller_1 = require("../application/usuarios/usuarios.controller");
const usuarios_service_1 = require("../application/usuarios/usuarios.service");
const productos_controller_1 = require("../application/productos/productos.controller");
const productos_service_1 = require("../application/productos/productos.service");
const subastas_controller_1 = require("../application/subastas/subastas.controller");
const subastas_service_1 = require("../application/subastas/subastas.service");
const pagos_controller_1 = require("../application/pagos/pagos.controller");
const pagos_service_1 = require("../application/pagos/pagos.service");
const alertas_controller_1 = require("../application/alertas/alertas.controller");
const alertas_service_1 = require("../application/alertas/alertas.service");
const ofertas_controller_1 = require("../application/ofertas/ofertas.controller");
const ofertas_service_1 = require("../application/ofertas/ofertas.service");
const servicios_controller_1 = require("../application/servicios/servicios.controller");
const servicios_service_1 = require("../application/servicios/servicios.service");
const tablero_controller_1 = require("../application/tablero/tablero.controller");
const seed_service_1 = require("../application/seed/seed.service");
const tablero_service_1 = require("../application/tablero/tablero.service");
const chat_controller_1 = require("../application/chat/chat.controller");
const chat_service_1 = require("../application/chat/chat.service");
const usuario_schema_1 = require("../infrastructure/schemas/usuario.schema");
const producto_schema_1 = require("../infrastructure/schemas/producto.schema");
const subasta_schema_1 = require("../infrastructure/schemas/subasta.schema");
const subasta_schema_2 = require("../infrastructure/schemas/subasta.schema");
const oferta_schema_1 = require("../infrastructure/schemas/oferta.schema");
const pago_schema_1 = require("../infrastructure/schemas/pago.schema");
const alerta_schema_1 = require("../infrastructure/schemas/alerta.schema");
const servicio_schema_1 = require("../infrastructure/schemas/servicio.schema");
const chat_schema_1 = require("../infrastructure/schemas/chat.schema");
const chat_schema_2 = require("../infrastructure/schemas/chat.schema");
const auction_gateway_1 = require("../infrastructure/websocket/auction.gateway");
const auth_guard_1 = require("../infrastructure/guards/auth.guard");
const roles_guard_1 = require("../infrastructure/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/cambalache'),
            mongoose_1.MongooseModule.forFeature([
                { name: usuario_schema_1.Usuario.name, schema: usuario_schema_1.UsuarioSchema },
                { name: producto_schema_1.Producto.name, schema: producto_schema_1.ProductoSchema },
                { name: subasta_schema_1.Subasta.name, schema: subasta_schema_1.SubastaSchema },
                { name: subasta_schema_2.Pujador.name, schema: subasta_schema_2.PujadorSchema },
                { name: oferta_schema_1.Oferta.name, schema: oferta_schema_1.OfertaSchema },
                { name: pago_schema_1.Pago.name, schema: pago_schema_1.PagoSchema },
                { name: alerta_schema_1.Alerta.name, schema: alerta_schema_1.AlertaSchema },
                { name: servicio_schema_1.Servicio.name, schema: servicio_schema_1.ServicioSchema },
                { name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema },
                { name: chat_schema_2.Mensaje.name, schema: chat_schema_2.MensajeSchema },
            ]),
        ],
        controllers: [
            autenticacion_controller_1.AutenticacionController,
            usuarios_controller_1.UsuariosController,
            productos_controller_1.ProductosController,
            subastas_controller_1.SubastasController,
            ofertas_controller_1.OfertasController,
            pagos_controller_1.PagosController,
            alertas_controller_1.AlertasController,
            tablero_controller_1.TableroController,
            servicios_controller_1.ServiciosController,
            chat_controller_1.ChatController,
        ],
        providers: [
            autenticacion_service_1.AutenticacionService,
            usuarios_service_1.UsuariosService,
            productos_service_1.ProductosService,
            subastas_service_1.SubastasService,
            ofertas_service_1.OfertasService,
            pagos_service_1.PagosService,
            alertas_service_1.AlertasService,
            tablero_service_1.TableroService,
            seed_service_1.SeedService,
            servicios_service_1.ServiciosService,
            chat_service_1.ChatService,
            auction_gateway_1.AuctionGateway,
            auth_guard_1.AuthGuard,
            roles_guard_1.RolesGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map