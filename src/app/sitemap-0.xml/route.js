import { get, includes } from 'lodash';
import { getAllSlugs } from '@/services/umbraco';

const regions = {
  en: 'International',
  ko: '한국',
  de: 'Deutschland',
  'en-ko': 'South Korea',
  'en-us': 'North America',
};

export async function GET() {
  try {
    const lang = process.env.NEXT_PUBLIC_LANG || 'en';
    const region = regions[lang];

    const contentTypes = [
      'home',
      'page',
      'product',
      'customerStory',
      'mediaItem',
      'howTo',
      'promotion',
      'preOwned',
      'media',
    ];

    const locales = ['en-us', 'ko', 'de'];

    const contentPromises = contentTypes.flatMap((type) =>
      locales.map((locale) => getAllSlugs(type, locale)),
    );

    const content = await Promise.all(contentPromises);
    const allItems = content.flat();

    const urls = [];
    const today = new Date().toISOString().split('T')[0];

    for (const page of allItems) {
      const path = get(page, 'route.path', '');
      const excludedRegions = get(page, 'properties.excludedRegions') || [];

      // Skip if page is excluded for this region
      if (includes(excludedRegions, region)) continue;

      // Match paths based on language
      let shouldInclude = false;
      let finalPath = '';

      if (lang === 'en' && includes(path, '/en/')) {
        shouldInclude = true;
        finalPath = path.replace('/en/', `/${lang}/`);
      } else if (lang === 'en-us' && includes(path, '/en/')) {
        shouldInclude = true;
        finalPath = path.replace('/en/', `/${lang}/`);
      } else if (lang === 'en-ko' && includes(path, '/en/')) {
        shouldInclude = true;
        finalPath = path.replace('/en/', `/${lang}/`);
      } else if (lang === 'ko' && includes(path, '/ko/')) {
        shouldInclude = true;
        finalPath = path;
      } else if (lang === 'de' && includes(path, '/de/')) {
        shouldInclude = true;
        finalPath = path;
      }

      if (shouldInclude && finalPath) {
        urls.push(`  <url>
    <loc>https://tym.world${finalPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
    }

    // Add homepage
    urls.unshift(`  <url>
    <loc>https://tym.world/${lang}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
      {
        headers: { 'Content-Type': 'application/xml' },
        status: 500,
      },
    );
  }
}
