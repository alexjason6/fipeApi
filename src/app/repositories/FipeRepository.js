const url = 'https://veiculos.fipe.org.br/api/veiculos';

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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
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