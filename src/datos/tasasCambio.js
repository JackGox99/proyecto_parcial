// Tabla de tasas de cambio reutilizada del ejercicio "cambioMoneda" de TypeScript.
// La llave es el codigo de la moneda y el valor es cuantos pesos colombianos cuesta.

export const TASAS_CAMBIO = {
  COP: 1,
  USD: 3202,
  EUR: 3676,
  MXN: 187,
  PEN: 933,
};

// Convierte un precio guardado en pesos colombianos a la moneda elegida
// y lo devuelve ya formateado como texto.
export function formatearPrecio(precioCop, moneda) {
  const tasa = TASAS_CAMBIO[moneda];

  if (!tasa) {
    return `${precioCop} COP`;
  }

  const convertido = precioCop / tasa;
  const decimales = moneda === 'COP' ? 0 : 2;

  return `${convertido.toFixed(decimales)} ${moneda}`;
}
