const CotacaoRepository = require('../repositories/CotacaoRepository');

class CotacaoController {
  async index(request, response) {
    const cotacoes = await CotacaoRepository.listAll();

    response.json(cotacoes);
  }

  async create(request, response) {
    const data = request.body;
    const cotacao = await CotacaoRepository.list(data);

    response.json(cotacao);
  }

}

module.exports = new CotacaoController();