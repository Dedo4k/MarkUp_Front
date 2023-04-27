import {Dataset} from "./dataset";

export interface User {
  username: string;
  roles: Role[];
  expired: boolean;
  locked: boolean;
  expiredCredentials: boolean;
  enabled: boolean;
  datasets: Dataset[];
}

export interface Role {
  id: string;
  operations: Operation[];
}

export interface Operation {
  id: string;
}
