export function formatPhone(phone: string) {
  return phone.replace(
    new RegExp('(\\d\\d)(\\d\\d\\d\\d\\d?)(\\d\\d\\d\\d)', 'g'),
    '($1) $2-$3',
  );
}
