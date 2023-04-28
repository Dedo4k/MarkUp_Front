import {Dataset} from "./dataset";

export interface User {
  username: string;
  roles: Role[];
  expired: boolean;
  locked: boolean;
  expiredCredentials: boolean;
  enabled: boolean;
  datasets: Dataset[];
  moderators: Moderator[];
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
}

export interface CreateUserDto {
  username: string;
  password: string;
  roles: string[];
  datasets: string[];
}
