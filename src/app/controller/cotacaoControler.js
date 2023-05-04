const CotacaoRepository = require('../repositories/CotacaoRepository');

class CotacaoController {
  async index(request, response) {
    const cotacoes = await CotacaoRepository.findAll();

    response.json(cotacoes);
  }

  async create(request, response) {
    const data = request.body;
    const cotacao = await CotacaoRepository.create(data);

    response.send(cotacao);
  }

  async update(request, response) {
    const id = request.params;
    const data = request.body;
    const cotacao = await CotacaoRepository.update(id, data);

    response.send(cotacao);
  }

}

module.exports = new CotacaoController();