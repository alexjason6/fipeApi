module.exports = (request, response, next) => {
  const allowedOrigins = ['https://acuidar.com.br', 'https://*.acuidar.com.br', 'https://www.acuidar.com.br', 'http://localhost:3000'];
  const origin = request.headers.origin;
  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, OPTION');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Request-Headers', 'Content-Type');
  next();
};