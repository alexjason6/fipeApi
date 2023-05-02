const { Router } = require('express');
const cotacaoControler = require('./src/app/controller/cotacaoControler');
const fipeControler = require('./src/app/controller/fipeControler');
const productsControler = require('./src/app/controller/productsControler');
const router = Router();

//Rotas para pegar dados protudos para cotação no HostGator
router.get('/productscotacao', productsControler.index);

//Rotas para cotação
router.get('/lista-cotacoes', cotacaoControler.index);
router.post('/adiciona-cotacao', cotacaoControler.create);

//Rotas para lidar com consulta FIPE
router.get('/tabela-referencia', fipeControler.index);
router.post('/listbrands', fipeControler.showBrands);
router.post('/listmodels', fipeControler.showModels);
router.post('/listyears', fipeControler.showYears);
router.post('/showresults', fipeControler.result);

module.exports = router;