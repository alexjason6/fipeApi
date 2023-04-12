const FipeRepository = require('../repositories/FipeRepository');

class FipeController {
  async index(request, response) {
    const tabela = await FipeRepository.getTabela();

    response.json(tabela);
  }

  async showBrands(request, response) {
    const data = request.body;
    const endPoint = 'ConsultarMarcas';
    const brands = await FipeRepository.list(data, endPoint);

    response.json(brands);
  }

  async showModels(request, response) {
    const data = request.body;
    const endPoint = 'ConsultarModelos';
    const models = await FipeRepository.list(data, endPoint);

    response.json(models);
  }

  async showYears(request, response) {
    const data = request.body;
    const endPoint = 'ConsultarAnoModelo';
    const years = await FipeRepository.list(data, endPoint);

    response.json(years);
  }

  async result(request, response) {
    const data = request.body;
    const endPoint = 'ConsultarValorComTodosParametros';
    const result = await FipeRepository.list(data, endPoint);

    response.json(result);
  }

}

module.exports = new FipeController();