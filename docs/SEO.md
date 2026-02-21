# SEO Audit & Recommendations

> Comprehensive SEO analysis for koichin.com

## Current State

### `<head>` Tags (BaseLayout.astro)

**Present:**

- `charset="utf-8"`
- `viewport` content="width=device-width"
- `generator` (Astro)
- `description` (optional prop, often undefined)
- `title` (SEO optimized with `| Koichi Nakayamada` suffix)
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type`
- Twitter Cards: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:creator`
- `canonical` link
- `icon` (favicon.svg)
- Feed alternates (RSS/Atom)

**Missing:**

- `og:image` / `twitter:image` - No social share images
- `twitter:site` - Missing site attribution
- `og:site_name` - Missing site name
- `og:locale` - Missing locale (en_US)
- `og:type` dynamic - Always "website", should be "article" for posts
- Article-specific meta (published_time, modified_time, tags)
- `viewport` missing `initial-scale=1`

### Pages Without Descriptions

Critical pages missing `description` prop:

- Home page (`/`) - No description passed
- Writing list (`/writing`)
- Writing posts (`/writing/[slug]`)
- Project list (`/project`)
- About page (`/about`)
- Site info pages (privacy, license, cookie)

### Technical SEO

**Strengths:**

- ✅ Canonical URLs implemented
- ✅ Sitemap generated (`/sitemap-index.xml`)
- ✅ Robots.txt properly configured
- ✅ RSS/Atom feeds available
- ✅ Semantic HTML structure
- ✅ Fast font loading (display: block)

**Issues:**

- ⚠️ No structured data (JSON-LD)
- ⚠️ No breadcrumb markup
- ⚠️ Missing alt text validation for images
- ⚠️ No hreflang for future i18n

## Recommendations

### Priority 1: Critical Missing Tags

#### 1. Add Default Meta Values

Update `BaseLayout.astro`:

```typescript
import defaultOgImage from "../assets/social-default.jpg?url";

const DEFAULT_DESCRIPTION =
    "Koichi Nakayamada - Data science student and open-source developer practicing technical philanthropy";
const SITE_NAME = "Koichi Nakayamada";
const DEFAULT_OG_IMAGE = defaultOgImage;
const LOCALE = "en_US";

// Fallback description
const metaDescription = description || DEFAULT_DESCRIPTION;
```

#### 2. Add Missing Social Meta Tags

```html
<!-- Open Graph -->
<meta property="og:site_name" content="{SITE_NAME}" />
<meta property="og:locale" content="{LOCALE}" />
<meta
    property="og:image"
    content="{new"
    URL(ogImage
    ||
    DEFAULT_OG_IMAGE,
    Astro.site)}
/>
<meta
    property="og:image:alt"
    content="{ogImageAlt"
    ||
    `${SITE_NAME}
    -
    ${title}`}
/>

<!-- Twitter -->
<meta name="twitter:site" content="@koichincom" />
<meta
    name="twitter:image"
    content="{new"
    URL(ogImage
    ||
    DEFAULT_OG_IMAGE,
    Astro.site)}
/>
<meta
    name="twitter:image:alt"
    content="{ogImageAlt"
    ||
    `${SITE_NAME}
    -
    ${title}`}
/>
```

#### 3. Fix Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Priority 2: Content-Specific SEO

#### Writing Posts (Article Schema)

Update `WritingLayout.astro` to accept and render article meta:

```typescript
interface Props {
    // ... existing props
    ogImage?: string;
    ogImageAlt?: string;
    tags?: string[];
}
```

Add to `<head>` via slot or prop drilling:

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="{published.toISOString()}" />
{lastUpdated &&
<meta property="article:modified_time" content="{lastUpdated.toISOString()}" />}
{tags?.map(tag => <meta property="article:tag" content="{tag}" />)}
```

#### Content Schema Update

Add to `content.config.ts` for writing collection:

```typescript
ogImage: z.string().optional().describe("Custom OG image for this post"),
ogImageAlt: z.string().optional().describe("Alt text for OG image"),
```

### Priority 3: Structured Data (JSON-LD)

#### Person Schema (Home/About)

```html
<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Koichi Nakayamada",
        "url": "https://koichin.com",
        "sameAs": [
            "https://github.com/koichincom",
            "https://x.com/koichincom",
            "https://linkedin.com/in/koichincom/"
        ],
        "jobTitle": "Data Science Student",
        "description": "Japanese data science student and open-source developer"
    }
</script>
```

#### BlogPosting Schema (Writing Posts)

```html
<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Post Title",
        "author": {
            "@type": "Person",
            "name": "Koichi Nakayamada"
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-15",
        "description": "Post description"
    }
</script>
```

### Priority 4: Page-Specific Improvements

#### Home Page

```typescript
const description =
    "Koichi Nakayamada - Data science student and open-source developer practicing technical philanthropy";
```

#### Writing List Page

```typescript
const description =
    "Technical writing on data science, open-source development, and technology for social good";
```

#### Project List Page

```typescript
const description =
    "Open-source projects and technical work by Koichi Nakayamada";
```

#### About Page

```typescript
const description =
    "Learn about Koichi Nakayamada, a data science student passionate about technical philanthropy";
```

### Priority 5: Technical Enhancements

#### Image Optimization Checklist

- [ ] Ensure all images have `alt` attributes
- [ ] Use descriptive filenames (e.g., `koichi-nakayamada-portrait.jpg` not `IMG_1234.jpg`)
- [ ] Implement lazy loading for below-fold images
- [ ] Consider WebP format with fallbacks

#### URL Structure

Current: ✅ Clean, semantic URLs

- `/writing/post-slug`
- `/project`
- `/about`

Consider:

- [ ] Trailing slash consistency
- [ ] URL normalization redirects

#### Performance

Current: ✅ Good practices in place

- Font display: block prevents layout shift
- View transitions with no animation

Consider:

- [ ] Preconnect to external domains (if any)
- [ ] Resource hints for critical assets

## Implementation Priority

### Phase 1 (Critical)

1. Add default description fallback
2. Add `og:image` and `twitter:image`
3. Fix viewport meta tag
4. Add descriptions to all main pages

### Phase 2 (Important)

1. Implement article schema for writing posts
2. Add JSON-LD structured data
3. Add `twitter:site`, `og:site_name`, `og:locale`

### Phase 3 (Nice to have)

1. Per-post custom OG images
2. Breadcrumb structured data
3. Image alt text audit

## Testing

Use these tools to validate:

- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## Files to Modify

1. `src/layouts/BaseLayout.astro` - Core meta tags
2. `src/layouts/WritingLayout.astro` - Article-specific tags
3. `src/content.config.ts` - Add OG image fields
4. `src/pages/index.astro` - Add description
5. `src/pages/writing/index.astro` - Add description
6. `src/pages/project/index.astro` - Add description
7. `src/pages/about/index.astro` - Add description
8. Individual writing posts - Add descriptions and OG images

## Notes

- Keep OG image size around 1200x630px for optimal display
- Description should be 150-160 characters max
- Title should be 50-60 characters max
- Test social shares after implementation
