import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { IncomingMessage } from 'http'; // To type the request object
import { Server, WebSocket } from 'ws'; // Import Socket.IO types
import { subscribe, unsubscribe } from 'src/model/pubsub';

let connectionIdCounter = 0;

// By default, gateways listen on the same port as your HTTP server.
// You can specify a different port: @WebSocketGateway(8080, { ... })
// You can also spe
// cify a namespace: @WebSocketGateway({ namespace: '/chat' })
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

  async handleConnection(
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

    const connectionId = `con:${connectionIdCounter++}`;
    // attach userid to the websocket to maintain state.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (client as any).userId = token;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (client as any).connectionId = connectionId;

    await subscribe<any>(connectionId, token, (message) => {
      client.send(JSON.stringify(message));
    });
    //

    client.on('message', (message) => {
      console.log(message);
    });
  }

  handleDisconnect(client: WebSocket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = (client as any).userId as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const connectionId = (client as any).connectionId as string;

    if (userId) {
      unsubscribe(connectionId, userId);
    }

    this.logger.log(`Client ${userId} disconnected:`);
  }
}
