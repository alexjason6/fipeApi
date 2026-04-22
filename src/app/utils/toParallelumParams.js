const vehicleTypeMap = { 1: 'cars', 2: 'motorcycles', 3: 'trucks' };

function toParallelumParams(data) {
  return {
    vehicleType: vehicleTypeMap[data.codigoTipoVeiculo] || data.vehicleType || 'cars',
    reference: String(data.codigoTabelaReferencia || data.reference || ''),
    brandId: data.codigoMarca || data.brandId,
    modelId: data.codigoModelo || data.modelId,
    yearId: data.ano || data.yearId,
  };
}

module.exports = { toParallelumParams };
