import { api } from '../boot/axios';

import { IProduct } from '@models/IProduct';
import { sortItems } from '@helpers/utils/sortItems';

export interface IProductSave {
  label: string;
  description?: string;
  picture?: string;
  price: number;
  category: {
    id: string;
  };
}

export async function getProducts(
  categoryId: string,
): Promise<IProduct[]> {
  const response = await api.get<IProduct[]>('products', {
    params: {
      categoryId,
    },
  });

  return sortItems(response.data);
}

export async function getProduct(id: string): Promise<IProduct> {
  const response = await api.get<IProduct>(`products/${id}`);

  return response.data;
}

export async function saveProduct(product: IProductSave): Promise<IProduct> {
  const response = await api.post<IProduct>('products', product);

  return response.data;
}

export async function updateProduct(
  id: string,
  product: Partial<IProduct>,
): Promise<IProduct> {
  const response = await api.patch<IProduct>(`products/${id}`, product);

  return response.data;
}

export async function deleteProduct(product: IProduct): Promise<IProduct> {
  const response = await api.delete<IProduct>(`products/${product.id}`);

  return response.data;
}

export async function reorderProduct(
  product: IProduct,
  newIndex: number,
  isBefore: boolean,
): Promise<IProduct> {
  const operation = isBefore ? 'before' : 'after';

  const response = await api.post<IProduct>(
    `products/${product.id}/reorder-${operation}/${newIndex}`,
  );

  return response.data;
}

export async function updateProductComplements(
  product: IProduct,
  complementGroups: string[],
) {
  const response = await api.post<IProduct>(
    `products/${product.id}/update-complements`,
    { complementGroups },
  );

  return response.data;
}
