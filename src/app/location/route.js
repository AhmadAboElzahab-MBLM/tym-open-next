export const runtime = 'edge';

export async function POST(request) {
  try {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${process.env.NEXT_PUBLIC_HUBSPOT_API_KEY}`);
    myHeaders.append('Content-Type', 'application/json');

    const url = process.env.NEXT_PUBLIC_HUBSPOT_DEALERS_URL || '';

    return Response.json({ data: '' });
  } catch (error) {
    return Response.json({ error, data: [] });
  }
}
