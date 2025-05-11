import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeamMemberDocument = TeamMember & Document;

export enum TeamRole {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Fullstack = 'Fullstack',
  Designer = 'Designer',
  DevOps = 'DevOps',
  QA = 'QA',
  PO = 'PO',
  PM = 'PM',
  BA = 'BA',
  Intern = 'Intern',
  Unity = 'Unity',
}
export const TEAM_ROLES: TeamRole[] = Object.values(TeamRole);

@Schema({ _id: false })
export class Social {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}
const SocialSchema = SchemaFactory.createForClass(Social);

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthday: string;

  @Prop()
  nickname: string;

  @Prop()
  description: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [String], enum: TEAM_ROLES })
  roles: TeamRole[];

  @Prop({ type: [String], default: [] })
  hobbies: string[];

  @Prop({ type: [SocialSchema], default: [] })
  socials: Social[];

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId: Types.ObjectId;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
