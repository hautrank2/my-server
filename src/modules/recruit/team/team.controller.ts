import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags } from '@nestjs/swagger';
import { TeamQueryDto } from './dto/query-team.dto';
import { concatMap, from, toArray } from 'rxjs';

@ApiTags('Recruit')
@Controller('recruit/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Post('multiple')
  createMultiple(@Body() dtos: CreateTeamDto[]) {
    return from(dtos).pipe(
      concatMap(dto => this.teamService.create(dto)),
      toArray(),
    );
  }

  @Get()
  findAll(@Query() query: TeamQueryDto) {
    const { page = 1, pageSize = 10, ...filters } = query;
    return this.teamService.findAll(+page, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
