import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags } from '@nestjs/swagger';
import { JobQueryDto } from './dto/query-job.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Recruit')
@Controller('recruit/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  findAll(@Query() query: JobQueryDto) {
    const { page = 1, pageSize = 10, ...filters } = query;
    return this.jobService.findAll(+page, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }
}
