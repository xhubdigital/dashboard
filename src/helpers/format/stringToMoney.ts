export function stringToMoney(value: string): number {
  return Number(value.replace(',', '.').replace(/ /g, ''));
}
