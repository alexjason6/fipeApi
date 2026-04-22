const { Router } = require('express');
//const cotacaoControler = require('./src/app/controller/cotacaoControler');
const fipeControler = require('./src/app/controller/fipeControler');
const parallelumControler = require('./src/app/controller/parallelumControler');
//const productsControler = require('./src/app/controller/productsControler');
const router = Router();

//Rotas para pegar dados protudos para cotação no HostGator
//router.get('/productscotacao', productsControler.index);

//Rotas para cotação
//router.get('/lista-cotacoes', cotacaoControler.index);
//router.post('/adiciona-cotacao', cotacaoControler.create);
//router.put('/atualiza-cotacao/:id', cotacaoControler.update);

//Rotas para lidar com consulta FIPE
router.get('/tabela-referencia', fipeControler.index);
router.post('/listbrands', fipeControler.showBrands);
router.post('/listmodels', fipeControler.showModels);
router.post('/listyears', fipeControler.showYears);
router.post('/showresults', fipeControler.result);

//Rotas para consulta FIPE via Parallelum
router.get('/parallelum/tabela-referencia', parallelumControler.index);
router.post('/parallelum/listbrands', parallelumControler.showBrands);
router.post('/parallelum/listmodels', parallelumControler.showModels);
router.post('/parallelum/listyears', parallelumControler.showYears);
router.post('/parallelum/showresults', parallelumControler.result);

router.get("/health", (req, res) => res.status(200).json({status: "ok"}));


module.exports = router;