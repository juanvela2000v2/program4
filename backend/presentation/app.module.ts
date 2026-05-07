import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutenticacionController } from '../application/autenticacion/autenticacion.controller';
import { AutenticacionService } from '../application/autenticacion/autenticacion.service';
import { UsuariosController } from '../application/usuarios/usuarios.controller';
import { UsuariosService } from '../application/usuarios/usuarios.service';
import { ProductosController } from '../application/productos/productos.controller';
import { ProductosService } from '../application/productos/productos.service';
import { SubastasController } from '../application/subastas/subastas.controller';
import { SubastasService } from '../application/subastas/subastas.service';
import { PagosController } from '../application/pagos/pagos.controller';
import { PagosService } from '../application/pagos/pagos.service';
import { AlertasController } from '../application/alertas/alertas.controller';
import { AlertasService } from '../application/alertas/alertas.service';
import { OfertasController } from '../application/ofertas/ofertas.controller';
import { OfertasService } from '../application/ofertas/ofertas.service';
import { ServiciosController } from '../application/servicios/servicios.controller';
import { ServiciosService } from '../application/servicios/servicios.service';
import { TableroController } from '../application/tablero/tablero.controller';
import { SeedService } from '../application/seed/seed.service';
import { TableroService } from '../application/tablero/tablero.service';
import { ChatController } from '../application/chat/chat.controller';
import { ChatService } from '../application/chat/chat.service';
import { Usuario, UsuarioSchema } from '../infrastructure/schemas/usuario.schema';
import { Producto, ProductoSchema } from '../infrastructure/schemas/producto.schema';
import { Subasta, SubastaSchema } from '../infrastructure/schemas/subasta.schema';
import { Pujador, PujadorSchema } from '../infrastructure/schemas/subasta.schema';
import { Oferta, OfertaSchema } from '../infrastructure/schemas/oferta.schema';
import { Pago, PagoSchema } from '../infrastructure/schemas/pago.schema';
import { Alerta, AlertaSchema } from '../infrastructure/schemas/alerta.schema';
import { Servicio, ServicioSchema } from '../infrastructure/schemas/servicio.schema';
import { Chat, ChatSchema } from '../infrastructure/schemas/chat.schema';
import { Mensaje, MensajeSchema } from '../infrastructure/schemas/chat.schema';
import { AuctionGateway } from '../infrastructure/websocket/auction.gateway';
import { AuthGuard } from '../infrastructure/guards/auth.guard';
import { RolesGuard } from '../infrastructure/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cambalache'),
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Producto.name, schema: ProductoSchema },
      { name: Subasta.name, schema: SubastaSchema },
      { name: Pujador.name, schema: PujadorSchema },
      { name: Oferta.name, schema: OfertaSchema },
      { name: Pago.name, schema: PagoSchema },
      { name: Alerta.name, schema: AlertaSchema },
      { name: Servicio.name, schema: ServicioSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Mensaje.name, schema: MensajeSchema },
    ]),
  ],
  controllers: [
    AutenticacionController,
    UsuariosController,
    ProductosController,
    SubastasController,
    OfertasController,
    PagosController,
    AlertasController,
    TableroController,
    ServiciosController,
    ChatController,
  ],
  providers: [
    AutenticacionService,
    UsuariosService,
    ProductosService,
    SubastasService,
    OfertasService,
    PagosService,
    AlertasService,
    TableroService,
    SeedService,
    ServiciosService,
    ChatService,
    AuctionGateway,
    AuthGuard,
    RolesGuard,
  ],
})
export class AppModule {}
