export default function optimizedImage(imageAttributes: {
    formats: {
        large: {
            url: string;
        };
        medium: {
            url: string;
        };
        small: {
            url: string;
        };
    };
    url: string;
} | null) {
    if (imageAttributes === null) return null;

    if (!imageAttributes.formats) return imageAttributes.url;
    if (imageAttributes.formats.large) return imageAttributes.formats.large.url;
    if (imageAttributes.formats.medium) return imageAttributes.formats.medium.url;
    if (imageAttributes.formats.small) return imageAttributes.formats.small.url;
    return imageAttributes.url;
}