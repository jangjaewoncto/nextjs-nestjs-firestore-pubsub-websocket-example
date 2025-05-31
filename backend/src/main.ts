import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws'; // 👈 Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app)); // Use the Socket.IO adapter

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
