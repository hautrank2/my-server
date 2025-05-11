import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember, TeamMemberDocument } from 'src/schemas/recruit';
import { Observable, from, forkJoin, map } from 'rxjs';
import { prettyObject } from 'src/types/common';
import { PaginationResponse } from 'src/types/response';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectModel(TeamMember.name)
    private teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  create(createTeamMemberDto: CreateTeamMemberDto): Observable<TeamMember> {
    const teamMember = new this.teamMemberModel(createTeamMemberDto);
    return from(teamMember.save());
  }

  findAll(
    page: number = 1,
    pageSize: number = 10,
    options?: Record<string, any>,
  ): Observable<PaginationResponse<TeamMember>> {
    page = !page ? 1 : page;
    pageSize = !pageSize ? 10 : pageSize;
    const skip = (page - 1) * pageSize;
    const filter = options ? prettyObject(options) : {};
    return forkJoin({
      total: from(this.teamMemberModel.countDocuments(filter)),
      items: from(
        this.teamMemberModel
          .find(filter)
          .skip(skip)
          .limit(pageSize)
          .lean()
          .exec(),
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

  findOne(id: string): Observable<TeamMember> {
    return from(
      this.teamMemberModel
        .findById(id)
        .exec()
        .then((teamMember: TeamMember | null) => {
          if (!teamMember) {
            throw new NotFoundException(`TeamMember with id ${id} not found`);
          }
          return teamMember;
        }),
    );
  }

  update(
    id: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
  ): Observable<TeamMember | null> {
    return from(
      this.teamMemberModel
        .findByIdAndUpdate(id, updateTeamMemberDto, {
          new: true,
        })
        .exec(),
    );
  }

  remove(id: string): Observable<TeamMember | null> {
    return from(this.teamMemberModel.findByIdAndDelete(id).exec());
  }
}
