const { HttpError } = require('../repositories/FipeRepository');

module.exports = (error, request, response, next) => {
  if (error instanceof HttpError) {
    console.warn(`[FIPE] ${error.status} ${error.message}`, error.details || '');
    return response.status(error.status).json({
      error: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return response.status(500).json({ error: 'Internal server error' });
};
