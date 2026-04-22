const { useFipeOficial } = require('../../config/keys');
const { toParallelumParams } = require('../utils/toParallelumParams');
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

    const p = toParallelumParams(data);

    const brands = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarMarcas')
      : await ParallelumRepository.getBrands(p.vehicleType, p.reference);

    response.json(brands);
  }

  async showModels(request, response) {
    const data = request.body;
    const p = toParallelumParams(data);

    const models = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarModelos')
      : await ParallelumRepository.getModels(p.vehicleType, p.brandId, p.reference);

    response.json(models);
  }

  async showYears(request, response) {
    const data = request.body;
    const p = toParallelumParams(data);

    const years = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarAnoModelo')
      : await ParallelumRepository.getYears(p.vehicleType, p.brandId, p.modelId, p.reference);

    response.json(years);
  }

  async result(request, response) {
    const data = request.body;
    const p = toParallelumParams(data);

    const result = useFipeOficial
      ? await FipeRepository.list(data, 'ConsultarValorComTodosParametros')
      : await ParallelumRepository.getValue(p.vehicleType, p.brandId, p.modelId, p.yearId, p.reference);

    response.json(result);
  }
}

module.exports = new FipeController();