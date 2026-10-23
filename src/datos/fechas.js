// ----- Función -----
// Qué hace: convierte una fecha guardada en texto legible en español.
// Las fechas se guardan siempre en formato ISO, que es el que entiende
// JSON, y solo se traducen al momento de mostrarlas.
export function formatearFecha(iso) {
  const fecha = new Date(iso);

  // Si lo guardado no traia fecha, se evita mostrar "Invalid Date".
  if (!iso || isNaN(fecha.getTime())) {
    return 'fecha no registrada';
  }

  const dia = fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hora = fecha.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return dia + ' a las ' + hora;
}
