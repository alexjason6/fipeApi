const url = 'https://veiculos.fipe.org.br/api/veiculos';

// Cloudflare costuma bloquear requisições sem fingerprint de navegador (403 + HTML).
const browserLikeHeaders = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Origin: 'https://veiculos.fipe.org.br',
  Referer: 'https://veiculos.fipe.org.br/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

class FipeRepository {
  async request(endpoint, data = {}) {
    const body = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, String(value));
      }
    });

    const response = await fetch(`${url}/${endpoint}`, {
      method: 'POST',
      body: body.toString(),
      headers: browserLikeHeaders,
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(`FIPE request failed (${response.status}): ${raw.slice(0, 200)}`);
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`FIPE returned non-JSON response: ${raw.slice(0, 200)}`);
    }
  }

  async getTabela() {
    return this.request('ConsultarTabelaDeReferencia');
  }

  async list(data, endPoint) {
    return this.request(endPoint, data);
  }
}

module.exports = new FipeRepository();