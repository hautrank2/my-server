import { Module } from '@nestjs/common';
import { JobController } from './job/job.controller';
import { JobService } from './job/job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema, TeamMemberSchema, TeamSchema } from 'src/schemas/recruit';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { TeamMemberController } from './team-member/team-member.controller';
import { TeamMemberService } from './team-member/team-member.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
    MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]),
    MongooseModule.forFeature([
      { name: 'TeamMember', schema: TeamMemberSchema },
    ]),
  ],
  controllers: [JobController, TeamController, TeamMemberController],
  providers: [JobService, TeamService, TeamMemberService],
})
export class RecruitModule {}
