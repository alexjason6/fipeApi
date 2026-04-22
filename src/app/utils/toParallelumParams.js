const vehicleTypeMap = { 1: 'cars', 2: 'motorcycles', 3: 'trucks' };

function emptyToUndef(v) {
  if (v === '' || v === null || v === undefined) return undefined;
  return v;
}

/** Parallelum exige ano no path como "2017-3" (ano + código combustível FIPE). */
function buildYearId(data) {
  const explicit = emptyToUndef(data.yearId);
  if (explicit != null) return String(explicit);

  const ano = emptyToUndef(data.ano);
  if (ano != null && String(ano).includes('-')) return String(ano);

  const year = emptyToUndef(data.anoModelo) ?? ano;
  const fuel = emptyToUndef(data.codigoTipoCombustivel);
  if (year != null && fuel != null) return `${year}-${fuel}`;

  return ano != null ? String(ano) : undefined;
}

function toParallelumParams(data) {
  return {
    vehicleType: vehicleTypeMap[data.codigoTipoVeiculo] || data.vehicleType || 'cars',
    reference: String(data.codigoTabelaReferencia || data.reference || ''),
    brandId: data.codigoMarca ?? data.brandId,
    modelId: data.codigoModelo ?? data.modelId,
    yearId: buildYearId(data),
  };
}

module.exports = { toParallelumParams };
