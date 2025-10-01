module.exports = (request, response, next) => {
  const allowedOrigins = true;
  const origin = request.headers.origin;
  
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, OPTION');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Request-Headers', 'Content-Type');
  next();
};