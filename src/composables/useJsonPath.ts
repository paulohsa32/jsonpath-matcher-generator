import { v4 as uuid } from "uuid";
import { isArray, isObject, isPrimitive } from "../helpers";
import type { PathRef } from "../model";

export function useJsonPath(sample: { [key: string]: any } | any[]): string {
  const pathRefs: PathRef[] = [];

  function addPathRef(
    key: string,
    value: any,
    refId?: string,
    parentId?: string
  ): void {
    const id = refId || uuid();
    const parentRef = parentId ? getPathRef(parentId) : null;
    const layer = parentId ? (parentRef?.layer || 0) + 1 : 0;
    const type = isArray(value) ? "array" : typeof value;
    const fullPath = generateFullPath(key, parentId);

    if (key !== "{key}" && value !== "value") {
      pathRefs.push({ id, key, value, type, parentId, layer, fullPath });
    }
  }

  function getPathRef(id: string): PathRef {
    const ref = pathRefs.find((ref) => ref.id === id) || null;

    if (!ref) throw new Error(`PathRef ${id} not found`);

    return ref;
  }

  function getParent(id: string): PathRef | null {
    const child: PathRef = getPathRef(id);

    return child.parentId ? getPathRef(child.parentId) : null;
  }

  function getFullPathTo(id: string): string {
    const ref = getPathRef(id);
    const parentRef = getParent(id);
    const parentPath = parentRef?.fullPath || "$";

    if (parentRef && isRefArray(parentRef)) {
      return `${parentPath}[${ref.key}]`;
    }

    return `${parentPath}.${ref.key}`;
  }

  function generateFullPath(key: string, parentId?: string): string {
    if (parentId) {
      if (isArrayById(parentId)) {
        return `${getFullPathTo(parentId)}[${key}]`;
      }
      return `${getFullPathTo(parentId)}.${key}`;
    }
    return `$.${key}`;
  }

  function isRefArray(ref: PathRef) {
    return ref?.type === "array";
  }

  function isArrayById(id: string) {
    return getPathRef(id)?.type === "array";
  }

  function populatePathRefs(object: { [key: string]: any }, parentId?: string) {
    Object.keys(object).forEach((key) => {
      const id = uuid();

      if (isObject(object[key])) {
        addPathRef(key, object[key], id, parentId);
        populatePathRefs(object[key], id);
      } else if (isPrimitive(object[key])) {
        addPathRef(key, object[key], id, parentId);
      } else if (isArray(object[key])) {
        addPathRef(key, object[key], id, parentId);
        object[key].forEach((item: any) => populatePathRefs(item, id));
      }
    });
  }

  function getJsonPathString(sample: { [key: string]: any } | any[]) {
    populatePathRefs(sample);

    return `$[?(${pathRefs
      .filter((item) => isPrimitive(item.value))
      .map(({ fullPath, value }) => {
        const wrapperCharacter = typeof value === "boolean" ? "" : "'";
        return `&& ${fullPath}==${wrapperCharacter}${value}${wrapperCharacter}`;
      })
      .join(" ")
      .substring(3)})]`;
  }

  return getJsonPathString(sample);
}
