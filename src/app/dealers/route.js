import _, { flatten, map, range, get } from 'lodash';

export const runtime = 'edge';

export async function POST(request) {
  try {
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
      'company_owner_name',
      'dealer_category',
      'dealer_main_image',
      'dealer_additional_image_1',
      'dealer_additional_image_2',
      'dealer_additional_image_3',
      'dealer_about',
      'dealer_services',
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
    const results = [];

    for (const chunk of chunks) {
      const limit = 100;
      const after = chunk * 100;
      const chunkData = await fetchChunk(limit, after);

      results.push(chunkData);

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }

    const mappedResults = map(results, (val) => get(val, 'results', []));
    const flattenResults = flatten(mappedResults);
    return Response.json({ data: flattenResults });
  } catch (error) {
    return Response.json({ error, data: [] });
  }
}
