import _ from 'lodash';

export default function resolveTextInternalLinks(html, locale) {
  if (_.isNil(locale) || _.isEmpty(html)) return html;

  const pattern = /<a\s+([^>]*href="\/(en|[^\/]+)\/[^"]*"[^>]*)>/g;

  const updatedHtml = html.replace(pattern, (match, linkAttributes) => {
    const hrefMatch = linkAttributes.match(/href="(\/[^"]*)"/);
    if (!hrefMatch) return match;

    const hrefValue = hrefMatch[1];

    const updatedHref = `href="/${locale}${hrefValue.slice(hrefValue.indexOf('/', 1))}"`;

    const updatedLink = match.replace(hrefMatch[0], updatedHref);

    return updatedLink;
  });

  return updatedHtml;
}
