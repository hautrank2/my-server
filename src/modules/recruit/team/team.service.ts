import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import {
  Team,
  TeamDocument,
  TeamMember,
  TeamMemberDocument,
} from 'src/schemas/recruit';
import { PaginationResponse } from 'src/types/response';
import { prettyObject } from 'src/types/common';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(TeamMember.name)
    private teamMemberModel: Model<TeamMemberDocument>,
  ) {}

  create(createTeamDto: CreateTeamDto): Observable<Team> {
    const { members, ...teamDto } = createTeamDto;
    const team = new this.teamModel(teamDto);

    return from(team.save()).pipe(
      switchMap(savedTeam =>
        this.updateTeamMember(
          members?.map(e => e.toString()) ?? [],
          savedTeam,
        ).pipe(
          map(updatedMembers => ({
            ...savedTeam.toObject(),
            members: updatedMembers,
          })),
        ),
      ),
    );
  }

  updateTeamMember(
    ids: string[],
    team: TeamDocument,
  ): Observable<TeamMemberDocument[]> {
    if (!ids.length) return of([]);
    const updatePromises = ids.map(id =>
      this.teamMemberModel
        .findByIdAndUpdate(id, { teamId: team._id }, { new: true })
        .exec(),
    );
    return from(Promise.all(updatePromises)).pipe(
      map(
        results =>
          results.filter((member): member is NonNullable<typeof member> =>
            Boolean(member),
          ) as TeamMemberDocument[],
      ),
    );
  }

  findAll(
    page: number = 1,
    pageSize: number = 10,
    options?: Record<string, any>,
  ): Observable<PaginationResponse<Team>> {
    page = !page ? 1 : page;
    pageSize = !pageSize ? 10 : pageSize;
    const skip = (page - 1) * pageSize;
    const filter = options ? prettyObject(options) : {};
    return forkJoin({
      total: from(this.teamModel.countDocuments(filter)),
      items: from(
        this.teamModel.find(filter).skip(skip).limit(pageSize).lean().exec(),
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

  findOne(id: string): Observable<Team> {
    return from(
      this.teamModel
        .findById(id)
        .exec()
        .then((team: Team | null) => {
          if (!team) {
            throw new NotFoundException(`Team with id ${id} not found`);
          }
          return team;
        }),
    );
  }

  update(id: string, updateTeamDto: UpdateTeamDto): Observable<Team | null> {
    return from(
      this.teamModel
        .findByIdAndUpdate(id, updateTeamDto, {
          new: true,
        })
        .exec(),
    );
  }

  remove(id: string): Observable<Team | null> {
    return from(this.teamModel.findByIdAndDelete(id).exec());
  }
}
