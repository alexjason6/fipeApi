const { fetch, Agent, ProxyAgent } = require('undici');

const FIPE_HOST = 'https://veiculos.fipe.org.br';
const API_BASE = `${FIPE_HOST}/api/veiculos`;

const PROXY_URL =
  process.env.FIPE_PROXY_URL ||
  process.env.HTTPS_PROXY ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.http_proxy;

const dispatcher = PROXY_URL
  ? new ProxyAgent(PROXY_URL)
  : new Agent({
      keepAliveTimeout: 10_000,
      keepAliveMaxTimeout: 30_000,
      connect: { timeout: 15_000 },
    });

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const baseHeaders = {
  'User-Agent': USER_AGENT,
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Sec-Ch-Ua':
    '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
};

const apiHeaders = {
  ...baseHeaders,
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Origin: FIPE_HOST,
  Referer: `${FIPE_HOST}/`,
  'X-Requested-With': 'XMLHttpRequest',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
};

class HttpError extends Error {
  constructor(message, status = 502, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CookieJar {
  constructor() {
    this.jar = new Map();
    this.lastWarmupAt = 0;
  }

  serialize() {
    return Array.from(this.jar.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  ingest(setCookieHeaders) {
    if (!setCookieHeaders || setCookieHeaders.length === 0) return;
    for (const raw of setCookieHeaders) {
      const [pair] = raw.split(';');
      const eq = pair.indexOf('=');
      if (eq === -1) continue;
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (name) this.jar.set(name, value);
    }
  }

  clear() {
    this.jar.clear();
  }
}

const cookies = new CookieJar();

function readSetCookie(response) {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }
  const raw = response.headers.get('set-cookie');
  return raw ? [raw] : [];
}

async function warmup() {
  const now = Date.now();
  if (now - cookies.lastWarmupAt < 5_000) return;
  cookies.lastWarmupAt = now;

  try {
    const response = await fetch(`${FIPE_HOST}/`, {
      method: 'GET',
      dispatcher,
      headers: {
        ...baseHeaders,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
    });
    cookies.ingest(readSetCookie(response));
    await response.arrayBuffer();
  } catch (error) {
    console.warn('[FIPE] warmup failed:', error.message);
  }
}

async function rawRequest(endpoint, data) {
  const body = new URLSearchParams();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      body.append(key, String(value));
    }
  });

  const cookieHeader = cookies.serialize();
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    dispatcher,
    body: body.toString(),
    headers: {
      ...apiHeaders,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  cookies.ingest(readSetCookie(response));
  const raw = await response.text();
  return { status: response.status, ok: response.ok, raw };
}

async function requestWithRetry(endpoint, data) {
  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (attempt === 1 && cookies.jar.size === 0) {
      await warmup();
    }

    try {
      const { status, ok, raw } = await rawRequest(endpoint, data);

      if (ok) {
        try {
          return JSON.parse(raw);
        } catch (parseError) {
          lastError = new HttpError(
            'FIPE returned non-JSON response',
            502,
            raw.slice(0, 200)
          );
        }
      } else {
        lastError = new HttpError(
          `FIPE upstream responded ${status}`,
          status === 429 ? 429 : 502,
          raw.slice(0, 200)
        );

        if (status === 403 || status === 503 || status === 429) {
          cookies.clear();
          await warmup();
        }
      }
    } catch (networkError) {
      lastError = new HttpError(
        `FIPE network error: ${networkError.message}`,
        502
      );
    }

    if (attempt < maxAttempts) {
      const backoff = 300 * 2 ** (attempt - 1) + Math.floor(Math.random() * 150);
      await sleep(backoff);
    }
  }

  throw lastError;
}

class TtlCache {
  constructor() {
    this.store = new Map();
    this.inflight = new Map();
  }

  async get(key, ttlMs, loader) {
    const now = Date.now();
    const hit = this.store.get(key);
    if (hit && hit.expiresAt > now) return hit.value;

    if (this.inflight.has(key)) return this.inflight.get(key);

    const promise = loader()
      .then((value) => {
        this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
      })
      .catch((error) => {
        if (hit) return hit.value;
        throw error;
      })
      .finally(() => {
        this.inflight.delete(key);
      });

    this.inflight.set(key, promise);
    return promise;
  }
}

const cache = new TtlCache();

const TTL = {
  tabela: 6 * 60 * 60 * 1000,
  list: 60 * 60 * 1000,
  valor: 10 * 60 * 1000,
};

function cacheKeyFor(endpoint, data) {
  if (!data || Object.keys(data).length === 0) return endpoint;
  const sortedEntries = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return `${endpoint}?${new URLSearchParams(sortedEntries).toString()}`;
}

function ttlFor(endpoint) {
  if (endpoint === 'ConsultarTabelaDeReferencia') return TTL.tabela;
  if (endpoint === 'ConsultarValorComTodosParametros') return TTL.valor;
  return TTL.list;
}

class FipeRepository {
  async getTabela() {
    return cache.get('ConsultarTabelaDeReferencia', TTL.tabela, () =>
      requestWithRetry('ConsultarTabelaDeReferencia')
    );
  }

  async list(data, endPoint) {
    const key = cacheKeyFor(endPoint, data);
    return cache.get(key, ttlFor(endPoint), () =>
      requestWithRetry(endPoint, data)
    );
  }
}

module.exports = new FipeRepository();
module.exports.HttpError = HttpError;
