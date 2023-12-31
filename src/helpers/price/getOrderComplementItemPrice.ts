import {
  IOrderItemComplementGroupOption,
  IOrderItemComplementItem,
} from '@models/IOrder';

export function getOrderComplementItemPrice(
  item: IOrderItemComplementItem,
): number {
  return item.values
    .reduce((total: number, complement: IOrderItemComplementGroupOption) => {
      const { quantity, price } = complement;

      return total + (quantity * price);
    }, 0);
}
