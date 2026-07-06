// components/SEO.tsx
import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    noindex?: boolean;
}

export function SEO({ title, description, image, url, noindex }: SEOProps) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            <meta name="twitter:card" content="summary_large_image" />
            {url && <link rel="canonical" href={url} />}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
    );
}