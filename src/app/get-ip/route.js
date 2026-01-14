import _ from 'lodash';

export async function POST(request) {
  const res = await request.json();

  if (_.isEmpty(res)) {
    return Response.json({ status: 400, error: 'Invalid data format' });
  }

  const ip = _.get(res, 'ip', '');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const baseUrl = process.env.NEXT_PUBLIC_IPSTACK_ENDPOINT || '';
  const url = `${baseUrl}/${ip}?access_key=${process.env.NEXT_PUBLIC_IPSTACK_API_KEY}`;

  let response = await fetch(url, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  });
  response = await response.json();

  return Response.json({ data: response });
}
