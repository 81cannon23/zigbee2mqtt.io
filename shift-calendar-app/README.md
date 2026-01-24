# Calendario de Turnos

Aplicación personal para gestionar turnos de trabajo, desarrollada para dispositivos iOS.

## Características

### Calendario
- Vista mensual con navegación entre meses
- Código de colores por turno o día libre
- Día actual destacado con borde negro
- Selección múltiple de días (mantener pulsado)

### Turnos
- Crear turnos personalizados ilimitados
- Configurar: nombre, abreviatura, color, hora inicio/fin
- Soporte para turnos nocturnos (cruzan medianoche)

### Días Libres
- Tipos personalizables: Descanso, Vacaciones, Asuntos propios, etc.
- Modo de conteo: por días o por horas
- Horas editables día a día

### Festivos
- Domingos: festivo completo
- Sábados: festivo desde las 14:30
- Festivos personalizados manuales

### Datos por Día
- Horas extra
- Horas extraordinarias
- Compensación horaria
- Horas de exclusividad
- Bolsa de horas
- Notas

### Cambios de Turno
- Registro de intercambios con compañeros
- Ajuste automático del calendario

### Estadísticas Anuales
- Días y horas trabajadas
- Horas nocturnas (00:00-08:00, automático)
- Festivos trabajados (días y horas)
- Desglose por tipo de turno y día libre

### Exportación
- Exportación mensual o anual a JPG
- Compartir directamente vía WhatsApp, etc.
- Marca de agua sutil "designed by 1076"

## Instalación

```bash
cd shift-calendar-app
npm install
npm run dev
```

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (estado)
- date-fns (fechas)
- html-to-image (exportación)
- Lucide React (iconos)

## PWA

La app está preparada para instalarse como PWA en iOS:
1. Abrir en Safari
2. Compartir → Añadir a pantalla de inicio

## Datos

Todos los datos se guardan localmente (localStorage).
No hay sincronización con servidor ni autenticación.

---

*designed by 1076*
