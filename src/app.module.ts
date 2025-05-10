import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './core/services/upload.service';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './core/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UploadService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [UploadService],
})
export class AppModule {}
