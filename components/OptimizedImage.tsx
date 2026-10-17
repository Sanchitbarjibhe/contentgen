import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = Pick<
    ImageProps,
    "src" | "alt" | "width" | "height" | "className" | "sizes"
>;

export default function OptimizedImage({
    alt,
    ...props
}: OptimizedImageProps) {
    if (!alt.trim()) {
        throw new Error("OptimizedImage requires meaningful alt text.");
    }

    return <Image {...props} alt={alt} loading="lazy" />;
}