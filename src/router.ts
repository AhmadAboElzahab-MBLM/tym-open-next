export default {
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Map hostnames to workers
    switch (url.hostname) {
      case 'tym-open-next.zmajeed2047.workers.dev':
        return fetch(
          'https://tym-open-next-en.zmajeed2047.workers.dev' + url.pathname + url.search,
        );
      case 'us.tym-open-next.zmajeed2047.workers.dev':
        return fetch(
          'https://tym-open-next-en-us.zmajeed2047.workers.dev' + url.pathname + url.search,
        );
      case 'kr.tym-open-next.zmajeed2047.workers.dev':
        return fetch(
          'https://tym-open-next-en-ko.zmajeed2047.workers.dev' + url.pathname + url.search,
        );
      case 'ko.tym-open-next.zmajeed2047.workers.dev':
        return fetch(
          'https://tym-open-next-ko.zmajeed2047.workers.dev' + url.pathname + url.search,
        );
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
