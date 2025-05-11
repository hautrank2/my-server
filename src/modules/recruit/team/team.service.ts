import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { forkJoin, from, map, Observable } from 'rxjs';
import { Team, TeamDocument } from 'src/schemas/recruit';
import { PaginationResponse } from 'src/types/response';
import { prettyObject } from 'src/types/common';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  create(createTeamDto: CreateTeamDto): Observable<Team> {
    const team = new this.teamModel(createTeamDto);
    return from(team.save());
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
