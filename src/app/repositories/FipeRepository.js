const url = 'https://veiculos.fipe.org.br/api/veiculos';

class FipeRepository {
  async getTabela() {
    const response = await fetch(`${url}/ConsultarTabelaDeReferencia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json());

    return response;
  }

  async list(data, endPoint) {
    const response = await fetch(`${url}/${endPoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json());

    return response;
  }
}

module.exports = new FipeRepository();