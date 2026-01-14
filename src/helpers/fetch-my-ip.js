export default async function fetchMyIp() {
  try {
    const res = await fetch('https://get-ip-address.zmajeed2047.workers.dev/', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { userIP: '' };
  }
}
