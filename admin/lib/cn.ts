export type ClassValue = string | number | boolean | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).map(String).join(" ");
}
