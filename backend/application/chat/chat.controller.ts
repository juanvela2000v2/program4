import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('iniciar')
  async iniciar(@Req() request: any, @Body() body: any) {
    const user = request.user;
    return this.chatService.buscarOcrear(
      body.productoId,
      body.vendedorId,
      body.vendedorNombre,
      user.sub,
      user.nombre,
      body.productoTitulo
    );
  }

  @Get('mis-chats')
  async misChats(@Req() request: any) {
    return this.chatService.misChats(request.user.sub);
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @Get(':id/mensajes')
  async getMensajes(@Param('id') id: string, @Req() request: any) {
    await this.chatService.marcarLeido(id, request.user.sub);
    return this.chatService.getMessages(id);
  }

  @Post(':id/mensajes')
  async addMensaje(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: any
  ) {
    return this.chatService.addMessage(
      id,
      request.user.sub,
      request.user.nombre,
      body.contenido
    );
  }
}