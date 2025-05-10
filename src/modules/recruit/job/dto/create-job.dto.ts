import {
  IsString,
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { JobType } from 'src/schemas/recruit';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(JobType)
  type: JobType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsString({ each: true })
  requirement: string[];

  @IsArray()
  @IsString({ each: true })
  responsibility: string[];

  @IsArray()
  @IsString({ each: true })
  benefit: string[];
}
