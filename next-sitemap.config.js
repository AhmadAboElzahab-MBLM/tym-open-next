/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://tym.world${process.env.NEXT_PUBLIC_LANG || ''}`,
  generateRobotsTxt: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
};
