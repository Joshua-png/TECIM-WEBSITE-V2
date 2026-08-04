import Image, { type ImageProps } from "next/image";

export default function SectionImage({
  src,
  fallback = "No image",
  ...props
}: ImageProps & { fallback?: string }) {
  if (!src) {
    return (
      <div
        className={
          props.fill
            ? "section-image-fallback"
            : "section-image-fallback section-image-fallback-static"
        }
      >
        <span>{fallback}</span>
      </div>
    );
  }
  return <Image src={src} {...props} />;
}
