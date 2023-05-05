import {Dataset} from "./dataset";

export interface User {
  id: number;
  username: string;
  roles: Role[];
  expired: boolean;
  locked: boolean;
  expiredCredentials: boolean;
  enabled: boolean;
  datasets: Dataset[];
  moderators: Moderator[];
  userStatistics: UserStatistic[];
}

export interface Role {
  id: string;
  operations: Operation[];
}

export interface Operation {
  id: string;
}

export interface Moderator {
  id: number;
  username: string;
  roles: Role[];
  datasets: Dataset[];
  userStatistics: UserStatistic[];
}

export interface CreateUserDto {
  username: string;
  password: string;
  roles: string[];
  datasets: string[];
}

export interface EditUserDto {
  password: string;
  roles: string[];
  datasets: string[];
  enabled: boolean;
}

export interface CreateRoleDto {
  name: string;
  operations: string[];
}

export interface EditRoleDto {
  operations: string[];
}

export interface UserStatistic {
  userId: number;
  date: string;
  lastUpdateAt: string;
  totalTimeWorked: string;
  filesChecked: number;
  objectsChanged: number;
}
