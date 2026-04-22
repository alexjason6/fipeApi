const vehicleTypeMap = { 1: 'cars', 2: 'motorcycles', 3: 'trucks' };

/** Aceita camelCase ou PascalCase (ex.: clientes .NET). */
function getField(data, ...names) {
  for (const name of names) {
    const v = data[name];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  const lower = {};
  for (const k of Object.keys(data)) {
    lower[k.toLowerCase()] = data[k];
  }
  for (const name of names) {
    const v = lower[name.toLowerCase()];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function emptyToUndef(v) {
  if (v === '' || v === null || v === undefined) return undefined;
  return v;
}

function isParallelumYearFormat(s) {
  return /^\d{4}-\d+$/.test(String(s));
}

/** Parallelum: segmento de ano no path = "2017-3" (ano + código combustível FIPE). */
function buildYearId(data) {
  const fuel = emptyToUndef(
    getField(data, 'codigoTipoCombustivel', 'CodigoTipoCombustivel', 'tipoCombustivel', 'TipoCombustivel'),
  );

  const toSegment = (raw) => {
    if (raw === undefined || raw === null || raw === '') return undefined;
    const s = String(raw).trim();
    if (isParallelumYearFormat(s)) return s;
    if (fuel != null && /^\d{4}$/.test(s)) return `${s}-${fuel}`;
    return undefined;
  };

  const order = [
    getField(data, 'yearId', 'YearId'),
    getField(data, 'anoModelo', 'AnoModelo'),
    getField(data, 'ano', 'Ano'),
  ];

  for (const c of order) {
    const out = toSegment(c);
    if (out != null) return out;
  }
  return undefined;
}

function toParallelumParams(data) {
  const tipo = getField(data, 'codigoTipoVeiculo', 'CodigoTipoVeiculo');
  const ref = getField(data, 'codigoTabelaReferencia', 'CodigoTabelaReferencia', 'reference', 'Reference');

  return {
    vehicleType: vehicleTypeMap[tipo] || getField(data, 'vehicleType', 'VehicleType') || 'cars',
    reference: ref != null ? String(ref) : '',
    brandId: getField(data, 'codigoMarca', 'CodigoMarca', 'brandId', 'BrandId'),
    modelId: getField(data, 'codigoModelo', 'CodigoModelo', 'modelId', 'ModelId'),
    yearId: buildYearId(data),
  };
}

function isValidParallelumYearId(yearId) {
  return yearId != null && isParallelumYearFormat(yearId);
}

module.exports = { toParallelumParams, isValidParallelumYearId };
