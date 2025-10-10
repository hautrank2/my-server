import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import {
  CreateTeamMemberDto,
  CreateTeamMemberDtoSwagger,
} from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamQueryDto } from '../team/dto/query-team.dto';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/core/services/upload.service';
import { catchError, from, mergeMap, of, switchMap, throwError } from 'rxjs';
@ApiTags('Recruit')
@Controller('recruit/team-member')
export class TeamMemberController {
  constructor(
    private readonly service: TeamMemberService,
    private readonly uploadSrv: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create team member (with image upload)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTeamMemberDtoSwagger })
  create(
    @Body() dto: CreateTeamMemberDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image required');
    }
    return from(
      this.uploadSrv.uploadFile(file, ['recruit', 'team-member']),
    ).pipe(
      mergeMap(res => {
        console.log('upload', res);
        return !res
          ? throwError(
              () => new InternalServerErrorException('Upload file failed'),
            )
          : this.service.create({ ...dto, avatar: res }).pipe(
              catchError(err => {
                return this.uploadSrv
                  .removeFile(res)
                  .pipe(
                    switchMap(() =>
                      throwError(() => new BadRequestException(err)),
                    ),
                  );
              }),
            );
      }),
    );
  }

  @Get()
  findAll(@Query() query: TeamQueryDto) {
    const { page = 1, pageSize = 10, ...filters } = query;
    return this.service.findAll(+page, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.findOne(id).pipe(
      switchMap(dt => {
        if (!dt) {
          return throwError(
            () => new NotFoundException(`Category ${id} not found`),
          );
        }
        return this.service.remove(id).pipe(
          switchMap(() => {
            if (dt.avatar) return this.uploadSrv.removeFile(dt.avatar);
            return of(null);
          }),
        );
      }),
      catchError(err =>
        throwError(() => new InternalServerErrorException(err)),
      ),
    );
  }
}
