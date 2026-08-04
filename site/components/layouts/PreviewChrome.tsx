"use client";

import { usePathname } from "next/navigation";

export function PreviewChrome({
  nav,
  footer,
  children,
}: {
  nav: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sectionMatch = pathname.match(/^\/preview\/section\/([^/]+)$/);

  if (sectionMatch) {
    return (
      <>
        {sectionMatch[1] === "hero" ? nav : null}
        {children}
      </>
    );
  }

  return (
    <>
      {nav}
      {children}
      {footer}
    </>
  );
}
