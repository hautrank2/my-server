import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { forkJoin, from, map, Observable } from 'rxjs';
import { Job, JobDocument } from 'src/schemas/recruit';
import { PaginationResponse } from 'src/types/response';
import { prettyObject } from 'src/types/common';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  create(createJobDto: CreateJobDto): Observable<Job> {
    const job = new this.jobModel(createJobDto);
    return from(job.save());
  }

  findAll(
    page: number = 1,
    pageSize: number = 10,
    options?: Record<string, any>,
  ): Observable<PaginationResponse<Job>> {
    page = !page ? 1 : page;
    pageSize = !pageSize ? 10 : pageSize;
    const skip = (page - 1) * pageSize;
    const filter = options ? prettyObject(options) : {};
    return forkJoin({
      total: from(this.jobModel.countDocuments(filter)),
      items: from(
        this.jobModel.find(filter).skip(skip).limit(pageSize).lean().exec(),
      ),
    }).pipe(
      map(({ total, items }) => ({
        items,
        page,
        pageSize,
        total,
        totalPage: Math.ceil(total / pageSize),
      })),
    );
  }

  findOne(id: string): Observable<Job> {
    return from(
      this.jobModel
        .findById(id)
        .exec()
        .then((job: Job | null) => {
          if (!job) {
            throw new NotFoundException(`Job with id ${id} not found`);
          }
          return job;
        }),
    );
  }

  update(id: string, updateJobDto: UpdateJobDto): Observable<Job | null> {
    return from(
      this.jobModel
        .findByIdAndUpdate(id, updateJobDto, {
          new: true,
        })
        .exec(),
    );
  }

  remove(id: string): Observable<Job | null> {
    return from(this.jobModel.findByIdAndDelete(id).exec());
  }
}
