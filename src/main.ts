// src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Needed for cookies/auth
  });

  // Global serialization interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global prefix and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    prefix: 'v',
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // swagger
  setupSwagger(app);

  // Register TransformInterceptor after all configurations
  app.useGlobalInterceptors(new TransformInterceptor());

  // clobal pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only allow properties defined in the DTO
      forbidNonWhitelisted: false, // Throw an error if unknown properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  console.log(`Swagger is running on port ${process.env.PORT ?? 3000}/api-docs`);
}
bootstrap();
