import { NextResponse } from 'next/server';

const FALLBACK_BACKEND =
  process.env.NEXT_PUBLIC_API_URL || 'https://houseofgargi-backend-4gso.onrender.com';

const PRIMARY_BACKEND =
  process.env.BACKEND_INTERNAL_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : FALLBACK_BACKEND);

/**
 * Standardized Next.js route proxy to Fastify API Gateway
 * Forwards cookies, headers, body, and propagates Set-Cookie headers back to browser
 * Gracefully falls back to live deployed backend if local dev server is offline
 */
export async function proxyToBackend(
  req: Request,
  backendPath: string,
  options: { method?: string; body?: any } = {}
) {
  const incomingHeaders = new Headers(req.headers);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = incomingHeaders.get('cookie');
  if (cookie) headers['cookie'] = cookie;

  const auth = incomingHeaders.get('authorization');
  if (auth) headers['authorization'] = auth;

  let bodyContent = options.body;
  if (bodyContent === undefined && req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      bodyContent = await req.text();
    } catch {
      bodyContent = undefined;
    }
  } else if (bodyContent !== undefined && typeof bodyContent === 'object') {
    bodyContent = JSON.stringify(bodyContent);
  }

  const executeFetch = async (baseUrl: string) => {
    return fetch(`${baseUrl}${backendPath}`, {
      method: options.method || req.method,
      headers,
      body: bodyContent,
      cache: 'no-store',
    });
  };

  try {
    let res: Response;
    try {
      res = await executeFetch(PRIMARY_BACKEND);
    } catch (primaryErr: any) {
      // If primary local server is down, fallback to deployed backend
      if (PRIMARY_BACKEND !== FALLBACK_BACKEND) {
        res = await executeFetch(FALLBACK_BACKEND);
      } else {
        throw primaryErr;
      }
    }

    const data = await res.json().catch(() => ({}));
    const response = NextResponse.json(data, { status: res.status });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Failed connecting to Fastify API gateway',
      },
      { status: 502 }
    );
  }
}
