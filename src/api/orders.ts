import { api } from '../boot/axios';

import { IOrder, IOrderStatus } from '@models/IOrder';

interface IOrderFilter {
  status?: IOrderStatus[];
  orderNumber?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getOrders(filter: IOrderFilter): Promise<IOrder[]> {
  const response = await api.get<IOrder[]>('orders', { params: filter });

  return response.data;
}

export async function getOrder(id: string): Promise<IOrder> {
  const response = await api.get<IOrder>(`orders/${id}`);

  return response.data;
}

export async function updateOrderStatus(
  id: string,
  nextStatus: IOrderStatus,
  reason?: string,
): Promise<IOrder> {
  const response = await api.patch<IOrder>(`orders/${id}/status`, {
    status: nextStatus,
    reason,
  });

  return response.data;
}
