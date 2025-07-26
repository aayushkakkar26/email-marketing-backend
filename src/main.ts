import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
  origin: ['http://localhost:3001', 'http://51.21.152.45:3001'],
  credentials: true,
});
  app.use(json());
  app.use(urlencoded({ extended: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
