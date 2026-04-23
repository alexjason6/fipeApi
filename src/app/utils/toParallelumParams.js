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

/** Marca, modelo, referência, ano no path: aceita number ou string (ex.: 23 ou "23"). */
function asPathId(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number' && Number.isFinite(v)) return String(Math.trunc(v));
  const s = String(v).trim();
  return s === '' ? undefined : s;
}

function isParallelumYearFormat(s) {
  return /^\d{4}-\d+$/.test(String(s));
}

/** Parallelum: segmento de ano no path = "2017-3" (ano + código combustível FIPE). */
function buildYearId(data) {
  const fuelRaw = getField(data, 'codigoTipoCombustivel', 'CodigoTipoCombustivel', 'tipoCombustivel', 'TipoCombustivel');
  const fuel = emptyToUndef(fuelRaw);

  const toSegment = (raw) => {
    if (raw === undefined || raw === null || raw === '') return undefined;
    const s = String(raw).trim();
    if (isParallelumYearFormat(s)) return s;
    if (fuel != null && /^\d{4}$/.test(s)) return `${s}-${String(fuel).trim()}`;
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

/** codigoTipoVeiculo 1|"1" ou slug cars|Cars; vehicleType opcional como slug. */
function resolveVehicleType(tipoRaw, slugRaw) {
  const slug = emptyToUndef(slugRaw);
  if (slug != null) {
    const s = String(slug).trim().toLowerCase();
    if (s === 'cars' || s === 'motorcycles' || s === 'trucks') return s;
  }
  if (tipoRaw === undefined || tipoRaw === null || tipoRaw === '') return 'cars';
  if (typeof tipoRaw === 'string') {
    const t = tipoRaw.trim().toLowerCase();
    if (t === 'cars' || t === 'motorcycles' || t === 'trucks') return t;
  }
  const n = Number(String(tipoRaw).trim());
  if (!Number.isNaN(n) && vehicleTypeMap[n]) return vehicleTypeMap[n];
  return 'cars';
}

function toParallelumParams(data) {
  const tipo = getField(data, 'codigoTipoVeiculo', 'CodigoTipoVeiculo');
  const slug = getField(data, 'vehicleType', 'VehicleType');
  const ref = getField(data, 'codigoTabelaReferencia', 'CodigoTabelaReferencia', 'reference', 'Reference');

  const refStr = ref != null && ref !== '' ? String(ref).trim() : '';

  return {
    vehicleType: resolveVehicleType(tipo, slug),
    reference: refStr,
    brandId: asPathId(getField(data, 'codigoMarca', 'CodigoMarca', 'brandId', 'BrandId')),
    modelId: asPathId(getField(data, 'codigoModelo', 'CodigoModelo', 'modelId', 'ModelId')),
    yearId: asPathId(buildYearId(data)),
  };
}

function isValidParallelumYearId(yearId) {
  return yearId != null && isParallelumYearFormat(yearId);
}

module.exports = { toParallelumParams, isValidParallelumYearId };
