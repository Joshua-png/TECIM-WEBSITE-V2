import { type ReactNode } from "react";

type EditableTextProps = {
  path: string;
  editable?: boolean;
  children: ReactNode;
};

export function EditableText({
  path,
  editable = false,
  children,
}: EditableTextProps) {
  if (!editable) return <>{children}</>;
  return (
    <span data-editable-path={path} data-editable-type="text">
      {children}
    </span>
  );
}
