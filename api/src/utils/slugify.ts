export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniqueSlug(
  base: string,
  find: (slug: string) => Promise<{ id: string } | null>
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let index = 2;
  while (await find(candidate)) {
    candidate = `${root}-${index}`;
    index += 1;
  }
  return candidate;
}
