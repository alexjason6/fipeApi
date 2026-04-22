const { parallelumToken } = require('../../config/keys');

const baseUrl = 'https://fipe.parallelum.com.br/api/v2';

function segmentForVehicleType(vehicleType) {
  if (vehicleType === 1 || vehicleType === '1' || vehicleType === 'cars') return 'cars';
  if (vehicleType === 2 || vehicleType === '2' || vehicleType === 'motorcycles') return 'motorcycles';
  if (vehicleType === 3 || vehicleType === '3' || vehicleType === 'trucks') return 'trucks';
  return 'cars';
}

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
    const tipo = segmentForVehicleType(vehicleType);
    const url = new URL(`${baseUrl}/${tipo}/brands`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getModels(vehicleType, brandId, reference) {
    const tipo = segmentForVehicleType(vehicleType);
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getYears(vehicleType, brandId, modelId, reference) {
    const tipo = segmentForVehicleType(vehicleType);
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models/${modelId}/years`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }

  async getValue(vehicleType, brandId, modelId, yearId, reference) {
    const tipo = segmentForVehicleType(vehicleType);
    const url = new URL(`${baseUrl}/${tipo}/brands/${brandId}/models/${modelId}/years/${yearId}`);
    if (reference) url.searchParams.set('reference', reference);

    const response = await fetch(url, {
      headers: this.getHeaders(),
    }).then((res) => res.json());

    return response;
  }
}

module.exports = new ParallelumRepository();
