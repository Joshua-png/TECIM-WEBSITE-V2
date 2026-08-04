import { type ReactNode } from "react";

type EditableImageProps = {
  path: string;
  editable?: boolean;
  children: ReactNode;
};

export function EditableImage({
  path,
  editable = false,
  children,
}: EditableImageProps) {
  if (!editable) return <>{children}</>;
  return (
    <span data-editable-path={path} data-editable-type="image">
      {children}
    </span>
  );
}
