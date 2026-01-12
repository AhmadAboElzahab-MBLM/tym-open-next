import { get, range, map } from 'lodash';

export default async function getDealers() {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${process.env.NEXT_PUBLIC_HUBSPOT_API_KEY}`);
  myHeaders.append('Content-Type', 'application/json');

  const url = process.env.NEXT_PUBLIC_HUBSPOT_DEALERS_URL || '';

  const filters = [
    {
      propertyName: 'website_dealership_distributor_list',
      operator: 'EQ',
      value: true,
    },
    {
      propertyName: 'association__updated_',
      operator: 'EQ',
      value: 'Dealer/Distributor',
    },
  ];

  const sorts = ['firstName'];

  const properties = [
    'hs_object_id',
    'email',
    'company',
    'country',
    'city',
    'fax',
    'state',
    'phone',
    'mobilephone',
    'market_2',
    'zip',
    'website',
    'address',
    'google_maps_location',
    'financing_url',
  ];

  const fetchChunk = async (limit, after) => {
    const body = JSON.stringify({ filters, sorts, properties, limit, after });
    const options = { method: 'POST', headers: myHeaders, body, redirect: 'follow' };

    const chunkRes = await fetch(url, options);
    const chunkData = await chunkRes.json();
    return chunkData;
  };

  const total = get(
    await fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ filters, limit: 1, after: 0 }),
      redirect: 'follow',
    }).then((res) => res.json()),
    'total',
    0,
  );

  const chunks = range(Math.ceil(total / 100));
  const results = await Promise.all(map(chunks, async (chunk) => fetchChunk(100, chunk * 100)));

  return results;
}
