const { useFipeOficial } = require('../../config/keys');
const FipeRepository = require('../repositories/FipeRepository');
const ParallelumRepository = require('../repositories/ParallelumRepository');

const vehicleTypeMap = { 1: 'cars', 2: 'motorcycles', 3: 'trucks' };

function toParallelumParams(data) {
  return {
    vehicleType: vehicleTypeMap[data.codigoTipoVeiculo] || data.vehicleType || 'cars',
    reference:   String(data.codigoTabelaReferencia || data.reference || ''),
    brandId:     data.codigoMarca     || data.brandId,
    modelId:     data.codigoModelo    || data.modelId,
    yearId:      data.ano             || data.yearId,
  };
}

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