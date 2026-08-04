export type EditablePath = string;

export function getPath<T = unknown>(
  obj: unknown,
  path: EditablePath
): T | undefined {
  const segments = path.split(".");
  let current: unknown = obj;
  for (const segment of segments) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current as T;
}

export function setPath<T = unknown>(
  obj: Record<string, unknown>,
  path: EditablePath,
  value: T
): Record<string, unknown> {
  const segments = path.split(".");
  const root: Record<string, unknown> = { ...obj };

  let cursor: Record<string, unknown> | unknown[] = root;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextIsArray = /^\d+$/.test(segments[i + 1]);
    const existing: unknown = Array.isArray(cursor)
      ? cursor[Number(segment)]
      : cursor[segment];

    let nextContainer: Record<string, unknown> | unknown[];
    if (
      existing === undefined ||
      existing === null ||
      typeof existing !== "object"
    ) {
      nextContainer = nextIsArray ? [] : {};
    } else if (Array.isArray(existing)) {
      nextContainer = [...existing];
    } else {
      nextContainer = { ...existing };
    }

    (cursor as Record<string, unknown>)[segment] = nextContainer;
    cursor = nextContainer;
  }

  (cursor as Record<string, unknown>)[segments[segments.length - 1]] = value;
  return root;
}
