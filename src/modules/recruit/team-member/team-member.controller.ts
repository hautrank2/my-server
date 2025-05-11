import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiTags } from '@nestjs/swagger';
import { TeamQueryDto } from '../team/dto/query-team.dto';

@ApiTags('Recruit')
@Controller('recruit/team-member')
export class TeamMemberController {
  constructor(private readonly service: TeamMemberService) {}

  @Post()
  create(@Body() dto: CreateTeamMemberDto) {
    return this.service.create(dto);
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
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
