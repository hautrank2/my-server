import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ example: '/folder1' })
  @IsString()
  folder: string;

  @ApiPropertyOptional({ example: 'nameFile' })
  @IsOptional()
  @IsString()
  fileName?: string;
}

export class CreateFileSwaggerDto extends CreateFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
