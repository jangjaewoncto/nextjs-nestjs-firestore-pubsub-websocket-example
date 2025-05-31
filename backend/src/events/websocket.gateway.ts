import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { IncomingMessage } from 'http'; // To type the request object
import { Server, WebSocket } from 'ws'; // Import Socket.IO types

// By default, gateways listen on the same port as your HTTP server.
// You can specify a different port: @WebSocketGateway(8080, { ... })
// You can also specify a namespace: @WebSocketGateway({ namespace: '/chat' })
@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins, adjust for production
  },
  path: `/ws`,
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() // Injects the Socket.IO server instance
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  // Important!
  // We need to check if the client is authenticated!
  // We need to find the http connection and check the header! to authenticate!

  handleConnection(
    client: WebSocket,
    request: IncomingMessage,
    // ...args: any[]
  ) {
    const token = request.url?.split('=')[1] || ``;

    // if not authorized, disconnect!
    const authorized = !!token;
    if (!authorized) {
      client.close();
    }

    this.logger.log(`Client connected: ${token}`);
    client.emit('connection', 'Successfully connected to server!');

    //
  }

  // Importante!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: WebSocket) {
    this.logger.log(`Client disconnected:`);
  }

  // We're not using this method!
  // Listen for messages with the event name 'messageToServer'
  @SubscribeMessage('eventsToServer')
  handleMessage(
    @MessageBody() data: string, // Extracts the payload of the message
    @ConnectedSocket() client: WebSocket, // Injects the client socket instance
  ): void {
    // Can return data for acknowledgements
    this.logger.log(`Message from client : ${data}`);

    // Emit a message back to the specific client who sent this message
    client.emit('messageToClient', `Server received your message: ${data}`);

    // Or broadcast to all connected clients (except sender by default with client.broadcast.emit)
    // this.server.emit('messageToClient', `Broadcast from server: A client sent: ${data}`);

    // Or broadcast to all clients including the sender
    // this.server.emit('messageToClient', `Broadcast to everyone: ${data}`);

    // For acknowledgements, return the value
    // return { event: 'messageToServer', data: `Acknowledged: ${data}` };
  }

  // Example: Emitting an event periodically (e.g., from a service)
  sendTimeToAllClients() {
    this.server.emit('timeUpdate', new Date().toLocaleTimeString());
  }
}
