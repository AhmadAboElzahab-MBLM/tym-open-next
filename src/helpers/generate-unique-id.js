export default function generateUniqueId() {
  const uuid = crypto.randomUUID();
  const part1 = uuid.substring(0, 3).toUpperCase();
  const part2 = uuid.substring(9, 12).toUpperCase();
  const part3 = uuid.substring(14, 18).toUpperCase();
  return `${part1}-${part2}-${part3}`;
}

export function isValidUniqueId(str) {
  const pattern = /^[0-9A-F]{3}-[0-9A-F]{3}-[0-9A-F]{4}$/;
  return pattern.test(str);
}
