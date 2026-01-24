// Paleta de colores predefinida para turnos y días libres
export const SHIFT_COLORS = [
  '#3B82F6', // Azul
  '#EF4444', // Rojo
  '#10B981', // Verde
  '#F59E0B', // Naranja
  '#8B5CF6', // Púrpura
  '#EC4899', // Rosa
  '#06B6D4', // Cian
  '#84CC16', // Lima
  '#F97316', // Naranja oscuro
  '#6366F1', // Índigo
];

export const FREE_DAY_COLORS = [
  '#22C55E', // Verde
  '#3B82F6', // Azul
  '#A855F7', // Púrpura
  '#F59E0B', // Ámbar
  '#EC4899', // Rosa
  '#14B8A6', // Teal
  '#EF4444', // Rojo
  '#6366F1', // Índigo
  '#84CC16', // Lima
  '#F97316', // Naranja
  '#0EA5E9', // Celeste
  '#D946EF', // Fucsia
];

export const getContrastColor = (hexColor: string): string => {
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calcular luminosidad
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
