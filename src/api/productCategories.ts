import { api } from '../boot/axios';

import { IProductCategory } from '@models/IProductCategory';
import { sortItems } from '@helpers/utils/sortItems';

export async function getProductCategories(): Promise<IProductCategory[]> {
  const response = await api
    .get<IProductCategory[]>('product-categories');

  return sortItems(response.data);
}

export async function getProductCategory(
  id: string,
): Promise<IProductCategory> {
  const response = await api.get<IProductCategory>(`product-categories/${id}`);

  return response.data;
}

export async function getProductCategoriesAndProducts():
  Promise<IProductCategory[]>
{
  const response = await api
    .get<IProductCategory[]>('product-categories/with-products/all');

  return sortItems(response.data.map((category: IProductCategory) => {
    return {
      ...category,
      products: sortItems(category.products),
    };
  }));
}

export async function saveProductCategory(
  productCategory: IProductCategory,
): Promise<IProductCategory> {
  const response = await api
    .post<IProductCategory>('product-categories', productCategory);

  return response.data;
}

export async function updateProductCategory(
  id: string,
  productCategory: Partial<IProductCategory>,
): Promise<IProductCategory> {
  const response = await api.patch<IProductCategory>(
    `product-categories/${id}`,
    productCategory,
  );

  return response.data;
}

export async function deleteProductCategory(
  productCategory: IProductCategory,
): Promise<IProductCategory> {
  const response = await api
    .delete<IProductCategory>(`product-categories/${productCategory.id}`);

  return response.data;
}

export async function reorderProductCategory(
  productCategory: IProductCategory,
  newIndex: number,
  isBefore: boolean,
): Promise<IProductCategory> {
  const operation = isBefore ? 'before' : 'after';

  const response = await api.post<IProductCategory>(
    `product-categories/${productCategory.id}/reorder-${operation}/${newIndex}`,
  );

  return response.data;
}
