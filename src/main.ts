import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import configuration from './configuration';

async function bootstrap() {
  const PORT = configuration().port ?? 3000;
  const VERSION = configuration().version;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('hautrank2 server')
    .setDescription('This is my server where I can do everthing with my apps')
    .setVersion(VERSION)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
