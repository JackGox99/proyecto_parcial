// Tabla de tasas de cambio reutilizada del ejercicio "cambioMoneda" de TypeScript.
// La llave es el codigo de la moneda y el valor es cuantos pesos colombianos cuesta.

export const TASAS_CAMBIO = {
  COP: 1,
  USD: 3202,
  EUR: 3676,
  MXN: 187,
  PEN: 933,
};

// Simbolo que se escribe antes del valor en cada moneda.
const SIMBOLOS = {
  COP: '$',
  USD: 'US$',
  EUR: '€',
  MXN: '$',
  PEN: 'S/',
};

// Escribe un numero al estilo colombiano: punto para separar los miles y coma
// para los decimales. Ejemplo: 2000000 queda "2.000.000".
function separarMiles(numero, decimales) {
  return numero.toLocaleString('es-CO', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

// Convierte un precio guardado en pesos colombianos a la moneda elegida
// y lo devuelve ya formateado como texto. Ejemplos:
// "$ 2.000.000 COP", "US$ 624,61 USD", "€ 544,07 EUR".
export function formatearPrecio(precioCop, moneda) {
  const tasa = TASAS_CAMBIO[moneda];

  if (!tasa) {
    return `$ ${separarMiles(precioCop, 0)} COP`;
  }

  const convertido = precioCop / tasa;
  const decimales = moneda === 'COP' ? 0 : 2;

  return `${SIMBOLOS[moneda]} ${separarMiles(convertido, decimales)} ${moneda}`;
}
