import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace '*' with your client's origin for better security
    methods: ['GET', 'POST'],
    // allowedHeaders: ['Content-Type'],
    // credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  private onlineUsers = new Set<string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.add(userId);

      client.join(userId); // Join the room named after the user ID
      this.broadcastOnlineUsers();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.broadcastOnlineUsers();
    }
  }
  private broadcastOnlineUsers() {
    // Broadcasting the list of online users to all connected clients
    this.server.emit('online-users', Array.from(this.onlineUsers));
  }
  //   @UseFilters(new BaseWsExceptionFilter())
  //   @SubscribeMessage('send-message')
  //   handleEvent(
  //     @MessageBody() data: string,
  //     // @ConnectedSocket() client: Socket,
  //     @GetUser('id') userId: string,
  //   ): void {
  //     // return data;

  //     this.server.emit('msg-receive', data);
  //   }

  sendMessageToUser(receiverId: string, message: any) {
    this.server.to(receiverId).emit('msg-receive', message);
  }
}
