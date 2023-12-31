import { api } from '@boot/axios';

import { IServiceFee } from '@models/IRestaurant';

export async function getServiceFee(id: string): Promise<IServiceFee> {
  const response = await api.get<IServiceFee>(`restaurants/service-fees/${id}`);

  return response.data;
}

export async function saveServiceFee(
  serviceFee: Omit<IServiceFee, 'id'>,
): Promise<IServiceFee> {
  const response = await api
    .post<IServiceFee>('restaurants/service-fees', serviceFee);

  return response.data;
}

export async function updateServiceFee(
  id: string,
  user: Partial<IServiceFee>,
): Promise<IServiceFee> {
  const response = await api
    .patch<IServiceFee>(`restaurants/service-fees/${id}`, user);

  return response.data;
}

export async function deleteServiceFee(
  serviceFee: IServiceFee,
): Promise<IServiceFee> {
  const response = await api
    .delete<IServiceFee>(`restaurants/service-fees/${serviceFee.id}`);

  return response.data;
}
