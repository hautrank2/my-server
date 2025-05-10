import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

export enum JobType {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Hybrid = 'Hybrid',
}
export const JOB_TYPE_ARRAY: JobType[] = Object.values(JobType);

export interface Skill {
  key: string; // ví dụ: 'node', 'angular'
  title: string; // tên hiển thị: 'Node.js', 'Angular'
  logo: string; // link hình logo
}

@Schema({ timestamps: true }) // tạo createdAt, updatedAt tự động
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: JOB_TYPE_ARRAY })
  type: JobType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: [String], required: true })
  requirement: string[];

  @Prop({ type: [String], required: true })
  responsibility: string[];

  @Prop({ type: [String], required: true })
  benefit: string[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
