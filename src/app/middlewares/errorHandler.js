module.exports = (error, request, response, next) => {
  console.error(error);

  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({
      error: 'JSON inválido no corpo da requisição.',
      hint: 'Certifique-se de usar aspas duplas nos valores string. Exemplo: "codigoTipoVeiculo": 1',
      received: error.body,
    });
  }

  response.status(500).json({ error: 'Erro interno no servidor.' });
};
