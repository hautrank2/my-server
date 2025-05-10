import { Module } from '@nestjs/common';
import { JobController } from './job/job.controller';
import { JobService } from './job/job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from 'src/schemas/recruit';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])],
  controllers: [JobController],
  providers: [JobService],
})
export class RecruitModule {}
