export const isObject = (item: any) =>
  item && typeof item === "object" && !Array.isArray(item);

export const isArray = (item: any) => item && Array.isArray(item);

export const isPrimitive = (item: any) =>
  item &&
  (typeof item === "string" ||
    typeof item === "number" ||
    typeof item === "boolean");

export function isValidJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
