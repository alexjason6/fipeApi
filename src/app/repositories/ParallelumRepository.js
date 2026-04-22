const { parallelumToken } = require('../../config/keys');

const baseUrl = 'https://fipe.parallelum.com.br/api/v2';

class ParallelumRepository {
  getHeaders() {
    return {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Subscription-Token': parallelumToken,
    };
  }

  async getTabela() {
    const response = await fetch(`${baseUrl}/references`, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getBrands(vehicleType, reference) {
    const tipo = vehicleType === 1 ? 'cars' : vehicleType === 2 ? 'motorcycles' : 'trucks';
    const url = new URL(`${baseUrl}/${tipo}/brands`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getModels(vehicleType, brandId, reference) {
    const tipo = vehicleType === 1 ? 'carro' : vehicleType === 2 ? 'moto' : 'caminhao';
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getYears(vehicleType, brandId, modelId, reference) {
    const tipo = vehicleType === 1 ? 'carro' : vehicleType === 2 ? 'moto' : 'caminhao';
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models/${modelId}/years`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getValue(vehicleType, brandId, modelId, yearId, reference) {
    const tipo = vehicleType === 1 ? 'carro' : vehicleType === 2 ? 'moto' : 'caminhao';
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models/${modelId}/years/${yearId}`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }
}

module.exports = new ParallelumRepository();
