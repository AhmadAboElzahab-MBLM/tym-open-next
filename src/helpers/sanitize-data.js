/**
 * Removes circular references from an object to make it JSON-serializable.
 * This is needed when passing data from server to client components in Next.js.
 */
export default function sanitizeData(obj) {
  const seen = new WeakSet();

  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined; // Remove circular reference
        }
        seen.add(value);
      }
      return value;
    }),
  );
}
