module.exports = (request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://acuidar.com.br/*, https://*.acuidar.com.br');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  response.setHeader('Access-Control-Allow-Headers', '*');
  next();
};
