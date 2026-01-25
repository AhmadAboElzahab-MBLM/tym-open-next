/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://tym.world/${process.env.NEXT_PUBLIC_LANG || ''}`,
  generateRobotsTxt: true, // Generate robots.txt file alongside sitemap.xml
  changefreq: 'daily', // Change frequency of updates
  priority: 0.7, // Priority of URLs in sitemap
  sitemapSize: 7000, // Limit of URLs per sitemap file
  // exclude: ['/admin/*'],   // Exclude specific routes if needed
};
