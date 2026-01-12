import _ from 'lodash';

export const runtime = 'edge';

export async function POST(request) {
  const res = await request.json();

  if (_.isEmpty(res)) {
    return Response.json({ status: 400, error: 'Invalid data format' });
  }

  const lang = _.get(res, 'lang', '');
  const locale = _.get(res, 'locale', '');
  const searchTerm = _.get(res, 'searchTerm', '');

  const query = `?q=${searchTerm}&limit=1000&offset=0&culture=${locale}&region=${lang}`;
  const url = process.env.NEXT_PUBLIC_UMBRACO_SEARCH_API;

  const data = await fetch(url + query, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  const response = await data.json();

  return Response.json({ data: response });
}
