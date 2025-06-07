import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TeamMemberDocument } from 'src/schemas/recruit';

export class TeamQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isMembers?: boolean;
}

export class TeamWithMembers {
  _id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  members: TeamMemberDocument[];
}
