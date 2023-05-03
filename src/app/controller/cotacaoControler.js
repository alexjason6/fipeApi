const CotacaoRepository = require('../repositories/CotacaoRepository');

class CotacaoController {
  async index(request, response) {
    const cotacoes = await CotacaoRepository.findAll();

    response.json(cotacoes);
  }

  async create(request, response) {
    const data = request.body;
    const cotacao = await CotacaoRepository.create(data);

    response.json(cotacao);
  }

}

module.exports = new CotacaoController();