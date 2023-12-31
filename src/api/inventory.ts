import { api } from '@boot/axios';

import { IInventoryItem, INewInventoryItem } from '@models/IInventoryItem';

export async function getInventoryItems(): Promise<IInventoryItem[]> {
  const response = await api.get<IInventoryItem[]>('inventory/items');

  return response.data;
}

export async function getInventoryItem(id: string): Promise<IInventoryItem> {
  const response = await api.get<IInventoryItem>(`inventory/items/${id}`);

  return response.data;
}

export async function saveInventoryItem(
  inventoryItem: INewInventoryItem,
): Promise<IInventoryItem> {
  const response = await api.post<IInventoryItem>(
    'inventory/items',
    inventoryItem,
  );

  return response.data;
}

export async function updateInventoryItem(
  id: string,
  inventoryItem: Partial<IInventoryItem>,
): Promise<IInventoryItem> {
  const response = await api.patch<IInventoryItem>(
    `inventory/items/${id}`,
    inventoryItem,
  );

  return response.data;
}

export async function updateInventoryItemAmount(
  id: string,
  change: number,
): Promise<IInventoryItem> {
  const response = await api.patch<IInventoryItem>(
    `inventory/items/${id}/amount`,
    { change },
  );

  return response.data;
}

export async function deleteInventoryItem(
  inventoryItem: IInventoryItem,
): Promise<IInventoryItem> {
  const response = await api
    .delete<IInventoryItem>(`inventory/items/${inventoryItem.id}`);

  return response.data;
}
