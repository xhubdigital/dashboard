import { api } from '@boot/axios';
import { IClient } from '@models/IClient';

export async function getClients(): Promise<IClient[]> {
  const response = await api.get<IClient[]>('clients');

  return response.data;
}
