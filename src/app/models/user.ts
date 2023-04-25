export interface User {
  username: string;
  roles: Role[];
  expired: boolean;
  locked: boolean;
  expiredCredentials: boolean;
  enabled: boolean;
}

export interface Role {
  id: string;
  operations: Operation[];
}

export interface Operation {
  id: string;
}
