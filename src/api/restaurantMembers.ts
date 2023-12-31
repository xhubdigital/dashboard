import { api } from '@boot/axios';

import { IUser } from '@models/IUser';

export async function getRestaurantMembers(): Promise<IUser[]> {
  const response = await api.get<IUser[]>('restaurants/members');

  return response.data;
}

export async function getRestaurantMember(id: string): Promise<IUser> {
  const response = await api.get<IUser>(`restaurants/members/${id}`);

  return response.data;
}

export async function saveRestaurantMember(user: IUser): Promise<IUser> {
  const response = await api.post<IUser>('restaurants/members', user);

  return response.data;
}

export async function updateRestaurantMember(
  id: string,
  user: Partial<IUser>,
): Promise<IUser> {
  const response = await api.patch<IUser>(`restaurants/members/${id}`, user);

  return response.data;
}

export async function deleteRestaurantMember(user: IUser): Promise<IUser> {
  const response = await api.delete<IUser>(`restaurants/members/${user.id}`);

  return response.data;
}
