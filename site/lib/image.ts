export type ImageValue =
  | string
  | {
      public_id?: string;
      secure_url?: string;
      width?: number;
      height?: number;
    }
  | null
  | undefined;

export function imageUrl(value: ImageValue): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.secure_url ?? "";
}
