export function moneyToString(value: number): string {
  const strValue = value.toFixed(2).replace('.', ',');
  const separator = ' ';

  return strValue.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`);
}
