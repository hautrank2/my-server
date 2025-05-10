export interface Team {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
}

export interface TeamMember {
  _id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  nickname: string;
  description: string;
  avatar: string;
  email: string;
  roles: TeamRole[];
  hobbies: string[];
  socials: Social[];
  createdAt: string;
  updatedAt: string;
}

export interface Social {
  platform: string;
  url: string;
}

export type TeamRole =
  | 'Frontend'
  | 'Backend'
  | 'Fullstack'
  | 'Designer'
  | 'DevOps'
  | 'QA'
  | 'PO'
  | 'PM'
  | 'BA'
  | 'Intern'
  | 'Unity';

export const TEAM_ROLES: TeamRole[] = [
  'Frontend',
  'Backend',
  'Fullstack',
  'Designer',
  'DevOps',
  'QA',
  'PO',
  'PM',
  'BA',
  'Intern',
  'Unity',
];
