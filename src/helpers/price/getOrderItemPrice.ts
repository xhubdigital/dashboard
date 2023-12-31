import { IOrderItem, IOrderItemComplementItem } from '@models/IOrder';

import { getOrderComplementItemPrice } from './getOrderComplementItemPrice';

export function getOrderItemPrice(orderItem: IOrderItem) {
  const { quantity, complements } = orderItem;

  const totalComplements = (complements || [])
    .reduce((curr: number, cValue: IOrderItemComplementItem) => {
      return curr + getOrderComplementItemPrice(cValue);
    }, 0);

  return (orderItem.price + totalComplements) * quantity;
}
