import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API 명세서')
  .setVersion('0.1')
  // .addBearerAuth()
  .build();
