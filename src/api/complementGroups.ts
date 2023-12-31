import { api } from '../boot/axios';

import { IComplementGroup, IComplementGroupOption, ICreateComplementGroup, IUpdateComplementGroup } from '@models/IComplementGroup';
import { sortItems } from '@helpers/utils/sortItems';

export async function getComplementGroups(): Promise<IComplementGroup[]> {
  const response = await api
    .get<IComplementGroup[]>('complement-groups');

  return response.data.map((group: IComplementGroup) => {
    return {
      ...group,
      options: sortItems(group.options),
    };
  });
}

export async function getComplementGroup(
  id: string,
): Promise<IComplementGroup> {
  const response = await api
    .get<IComplementGroup>(`complement-groups/${id}`);

  return {
    ...response.data,
    options: sortItems(response.data.options),
  };
}

export async function saveComplementGroup(
  complementGroup: ICreateComplementGroup,
): Promise<IComplementGroup> {
  const response = await api
    .post<IComplementGroup>('complement-groups', complementGroup);

  return response.data;
}

export async function updateComplementGroup(
  id: string,
  complementGroup: Partial<IUpdateComplementGroup>,
): Promise<IComplementGroup> {
  const response = await api.patch<IComplementGroup>(
    `complement-groups/${id}`,
    complementGroup,
  );

  return {
    ...response.data,
    options: sortItems(response.data.options),
  };
}

export async function deleteComplementGroup(
  complementGroup: IComplementGroup,
): Promise<IComplementGroup> {
  const response = await api
    .delete<IComplementGroup>(`complement-groups/${complementGroup.id}`);

  return response.data;
}

export async function connectComplementGroupToProducts(
  complementGroup: IComplementGroup,
  products: string[],
): Promise<IComplementGroup> {
  const response = await api
    .post<IComplementGroup>(
      `complement-groups/${complementGroup.id}/connect-products`,
      { products },
    );

  return response.data;
}

export async function updateComplementGroupOption(
  groupId: string,
  optionId: string,
  complementGroupOption: Partial<IComplementGroupOption>,
): Promise<IComplementGroupOption> {
  const response = await api.patch<IComplementGroupOption>(
    `complement-groups/${groupId}/options/${optionId}`,
    complementGroupOption,
  );

  return response.data;
}
