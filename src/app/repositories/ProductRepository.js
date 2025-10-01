const url = 'https://acuidar.com.br';

class ProductRepository {
  async listAll() {
    const response = await fetch(`${url}/app/dataProductsCotacao.json`, {
      method: 'GET',
    }).then((res) => res.json());

    return response;
  }
}

module.exports = new ProductRepository();