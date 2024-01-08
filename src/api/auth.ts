import { api } from '../boot/axios';

import { IUser } from '@models/IUser';

export interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  taxpayerRegistry: string;
  phone: string;
  restaurant: {
    name: string,
  };
}

export async function signIn(
  email: string,
  password: string,
): Promise<ISignInResponse> {
  const data = { email, password };
  const response = await api.post<ISignInResponse>('users/auth', data);

  return response.data;
}

export async function signUp(data: IRegisterData): Promise<ISignInResponse> {
  const response = await api.post<ISignInResponse>('users/register', data);

  return response.data;
}

export async function refreshToken(
  refreshToken: string,
): Promise<ISignInResponse> {
  const response = await api.post<ISignInResponse>('users/refresh-token', {
    refreshToken,
  });

  return response.data;
}

export async function getUserData(): Promise<IUser> {
  const response = await api.get<IUser>('users/me');

  return response.data;
}
