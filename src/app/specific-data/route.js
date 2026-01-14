import _ from 'lodash';
import { getByContentTypeSpecificData } from '@/services/umbraco';

export async function POST(request) {
  const res = await request.json();

  if (_.isEmpty(res)) {
    return Response.json({ status: 400, error: 'Invalid data format' });
  }

  const contentType = _.get(res, 'contentType', '');
  const region = _.get(res, 'region', '');
  const locale = _.get(res, 'locale', '');
  const lang = _.get(res, 'lang', '');

  const data = await getByContentTypeSpecificData(contentType, region, locale, lang);

  return Response.json({ data });
}
