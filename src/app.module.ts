import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './core/services/upload.service';
import { RecruitModule } from './modules/recruit/recruit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    RecruitModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadService],
  exports: [UploadService],
})
export class AppModule {}
