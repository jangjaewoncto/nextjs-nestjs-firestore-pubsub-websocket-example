import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './events/websocket.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
