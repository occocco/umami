import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerConfig } from './config/swagger.config.js';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const xmlDocument = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, xmlDocument);

  app.enableCors({
    origins: process.env.APP_BASE_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
