const ProductRepository = require('../repositories/ProductRepository');

class ProductController {
  async index(request, response) {
    const products = await ProductRepository.listAll();

    response.json(products);
  }
}

module.exports = new ProductController();