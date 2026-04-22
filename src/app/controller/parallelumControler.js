const { toParallelumParams, isValidParallelumYearId } = require('../utils/toParallelumParams');
const ParallelumRepository = require('../repositories/ParallelumRepository');

class ParallelumController {
  async index(request, response) {
    const tabela = await ParallelumRepository.getTabela();
    response.json(tabela);
  }

  async showBrands(request, response) {
    const p = toParallelumParams(request.body);
    const brands = await ParallelumRepository.getBrands(p.vehicleType, p.reference);
    response.json(brands);
  }

  async showModels(request, response) {
    const p = toParallelumParams(request.body);
    const models = await ParallelumRepository.getModels(p.vehicleType, p.brandId, p.reference);
    response.json(models);
  }

  async showYears(request, response) {
    const p = toParallelumParams(request.body);
    const years = await ParallelumRepository.getYears(p.vehicleType, p.brandId, p.modelId, p.reference);
    response.json(years);
  }

  async result(request, response) {
    const p = toParallelumParams(request.body);

    if (!isValidParallelumYearId(p.yearId)) {
      return response.status(400).json({
        error:
          'Parallelum exige o ano no path como ANO-CÓDIGO_COMBUSTÍVEL (ex.: 2017-3). Envie anoModelo e codigoTipoCombustivel no JSON, ou yearId já montado.',
        computed: p,
      });
    }

    const result = await ParallelumRepository.getValue(p.vehicleType, p.brandId, p.modelId, p.yearId, p.reference);
    response.json(result);
  }
}

module.exports = new ParallelumController();
