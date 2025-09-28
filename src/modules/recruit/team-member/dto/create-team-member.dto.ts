import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { TeamRole } from 'src/schemas/recruit';
import { parseJson } from 'src/utils/json';

export class SocialLinkDto {
  @Expose()
  @IsString()
  platform: string;

  @Expose()
  @IsUrl()
  url: string;
}

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ISO date string (YYYY-MM-DD) or any date string you accept',
    example: '2001-04-30',
  })
  @IsString()
  birthday: string;

  @ApiProperty({ example: 'Ben' })
  @IsString()
  nickname: string;

  @ApiPropertyOptional({
    example: 'Front-end developer who loves TypeScript and Tailwind.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Enter email',
    example: 'hautrantrung.02@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    isArray: true,
    enum: TeamRole,
    example: [TeamRole.Frontend, TeamRole.Backend],
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v: string) => v.trim())
      : value,
  )
  @IsArray()
  @IsEnum(TeamRole, { each: true })
  roles: TeamRole[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Reading', 'Badminton', 'Photography'],
  })
  @Transform(({ value }: { value: string }) => {
    if (typeof value === 'string') {
      // = Reading,Badminton,Photography
      return value.split(',');
    }
    return value;
  })
  @IsOptional()
  @IsArray()
  hobbies?: string[];

  @ApiPropertyOptional({
    type: [SocialLinkDto],
    example: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/abc' },
      { platform: 'github', url: 'https://github.com/abc' },
    ],
  })
  @Transform(({ value }) => parseJson<SocialLinkDto[]>(value))
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socials?: SocialLinkDto[];

  @ApiPropertyOptional({
    description: 'Mongo ObjectId of the team',
    type: String,
    example: '68296b24b2549790699a575d',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsOptional()
  teamId?: string;
}

export class CreateTeamMemberDtoSwagger extends CreateTeamMemberDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
