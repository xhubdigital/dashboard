import { IUser } from '@models/IUser';

export interface UserState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

function state(): UserState {
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
  };
}

export default state;
