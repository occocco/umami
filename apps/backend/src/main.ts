import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const xmlDocument = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, xmlDocument);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
