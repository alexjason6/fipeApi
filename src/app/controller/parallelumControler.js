const ParallelumRepository = require('../repositories/ParallelumRepository');

class ParallelumController {
  async index(request, response) {
    const tabela = await ParallelumRepository.getTabela();
    response.json(tabela);
  }

  async showBrands(request, response) {
    const { vehicleType = 'cars', reference } = request.body;
    const brands = await ParallelumRepository.getBrands(vehicleType, reference);
    response.json(brands);
  }

  async showModels(request, response) {
    const { vehicleType = 'cars', brandId, reference } = request.body;
    const models = await ParallelumRepository.getModels(vehicleType, brandId, reference);
    response.json(models);
  }

  async showYears(request, response) {
    const { vehicleType = 'cars', brandId, modelId, reference } = request.body;
    const years = await ParallelumRepository.getYears(vehicleType, brandId, modelId, reference);
    response.json(years);
  }

  async result(request, response) {
    const { vehicleType = 'cars', brandId, modelId, yearId, reference } = request.body;
    const result = await ParallelumRepository.getValue(vehicleType, brandId, modelId, yearId, reference);
    response.json(result);
  }
}

module.exports = new ParallelumController();
