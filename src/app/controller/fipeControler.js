const { useFipeOficial } = require('../../config/keys');
const FipeRepository = require('../repositories/FipeRepository');
const ParallelumRepository = require('../repositories/ParallelumRepository');

class FipeController {
  async index(request, response) {
    const tabela = useFipeOficial
      ? await FipeRepository.getTabela()
      : await ParallelumRepository.getTabela();

    response.json(tabela);
  }

  async showBrands(request, response) {
    const data = request.body;

    const brands = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarMarcas')
      : await ParallelumRepository.getBrands(data.vehicleType, data.reference);

    response.json(brands);
  }

  async showModels(request, response) {
    const data = request.body;

    const models = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarModelos')
      : await ParallelumRepository.getModels(data.vehicleType, data.brandId, data.reference);

    response.json(models);
  }

  async showYears(request, response) {
    const data = request.body;

    const years = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarAnoModelo')
      : await ParallelumRepository.getYears(data.vehicleType, data.brandId, data.modelId, data.reference);

    response.json(years);
  }

  async result(request, response) {
    const data = request.body;

    const result = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarValorComTodosParametros')
      : await ParallelumRepository.getValue(data.vehicleType, data.brandId, data.modelId, data.yearId, data.reference);

    response.json(result);
  }
}

module.exports = new FipeController();