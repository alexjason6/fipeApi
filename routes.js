const { Router } = require('express');
const fipeControler = require('./src/app/controller/fipeControler');
const router = Router();

router.get('/tabela-referencia', fipeControler.index);
router.post('/listbrands', fipeControler.showBrands);
router.post('/listmodels', fipeControler.showModels);
router.post('/listyears', fipeControler.showYears);
router.post('/showresults', fipeControler.result);

module.exports = router;