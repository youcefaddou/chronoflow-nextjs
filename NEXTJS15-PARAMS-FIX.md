# Fix Next.js 15+ Dynamic Params Issue

## Problem
```
Error: Route "/ressources/[slug]" used `params.slug`. `params` should be awaited before using its properties.
```

## Root Cause
In Next.js 15+, dynamic route parameters must be awaited before accessing their properties.

## Solution Applied

### 1. Made the page function async
```javascript
// Before
export default function ArticlePage({ params }) {
    const article = articlesData[params.slug]

// After  
export default async function ArticlePage({ params }) {
    const { slug } = await params
    const article = articlesData[slug]
```

### 2. Fixed related articles filtering
```javascript
// Before
.filter(([slug]) => slug !== params.slug)

// After
.filter(([articleSlug]) => articleSlug !== slug)
```

### 3. Added async generateMetadata function
```javascript
export async function generateMetadata({ params }) {
    const { slug } = await params
    const article = articlesData[slug]
    // ... metadata generation
}
```

## Benefits
- ✅ Complies with Next.js 15+ requirements
- ✅ Improved SEO with proper metadata generation
- ✅ Better error handling
- ✅ Future-proof code structure

## Status: ✅ RESOLVED
All articles now load without errors and follow Next.js 15+ best practices.
