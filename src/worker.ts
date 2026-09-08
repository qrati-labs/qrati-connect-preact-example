interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
  GTM_ID?: string;
  VITE_GTM_ID?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const prefix = '/connect/preact-example';

    if (url.pathname === prefix || url.pathname === `${prefix}/`) {
      url.pathname = '/';
    } else if (url.pathname.startsWith(`${prefix}/`)) {
      url.pathname = url.pathname.slice(prefix.length) || '/';
    }

    const res = await env.ASSETS.fetch(new Request(url.toString(), request));
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('text/html')) return res;

    let html = await res.text();
    const gtmId = env.VITE_GTM_ID || env.GTM_ID;
    if (gtmId && gtmId !== '__GTM_ID__') {
      html = html.replaceAll('__GTM_ID__', gtmId);
    } else {
      html = html
        .replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\n?/g, '')
        .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\n?/g, '');
    }

    return new Response(html, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  },
};
