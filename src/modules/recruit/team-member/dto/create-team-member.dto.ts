import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { TeamRole } from 'src/schemas/recruit';

export class CreateTeamMemberDto {
  @IsString()
  name: string;

  @IsString()
  birthday: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  email: string;

  @IsArray()
  roles: TeamRole[];

  @IsOptional()
  @IsArray()
  hobbies?: string[];

  @IsOptional()
  socials?: { platform: string; url: string }[];

  // ✅ validate ObjectId
  @IsMongoId()
  @IsOptional()
  teamId?: string;
}
