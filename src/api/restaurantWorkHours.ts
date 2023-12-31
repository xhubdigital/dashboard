import { api } from '@boot/axios';

import { IWorkHours } from '@models/IWorkHours';

export async function getWorkHours(): Promise<IWorkHours[]> {
  const response = await api.get<IWorkHours[]>('restaurants/work-hours');

  return response.data;
}

export async function getWorkHour(id: string): Promise<IWorkHours> {
  const response = await api.get<IWorkHours>(`restaurants/work-hours/${id}`);

  return response.data;
}

export async function saveWorkHour(workHour: IWorkHours): Promise<IWorkHours> {
  const response = await api
    .post<IWorkHours>('restaurants/work-hours', workHour);

  return response.data;
}

export async function updateWorkHour(
  id: string,
  workHour: Partial<IWorkHours>,
): Promise<IWorkHours> {
  const response =
    await api.patch<IWorkHours>(`restaurants/work-hours/${id}`, workHour);

  return response.data;
}

export async function deleteWorkHour(
  workHour: IWorkHours,
): Promise<IWorkHours> {
  const response = await api
    .delete<IWorkHours>(`restaurants/work-hours/${workHour.id || ''}`);

  return response.data;
}
