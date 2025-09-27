# Sistema de Gestión de Citas - Backend

Este es el backend para un sistema de gestión de citas simple implementado en Node.js con Express y Supabase.

## Características

- API REST para gestionar citas
- Validación para evitar duplicados de fecha y hora
- Integración con Supabase para persistencia de datos
- Soporte para CORS para permitir solicitudes desde el frontend

## Estructura del Proyecto

```
.
├── server.js         # Código principal del servidor
├── .env             # Variables de entorno (no incluido en el repo)
├── setup_supabase.sql # Script SQL para crear la tabla
└── README.md        # Documentación (este archivo)
```

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   - Crear archivo `.env` con:
     ```
     SUPABASE_URL=https://tu-proyecto.supabase.co
     SUPABASE_ANON_KEY=tu_anon_key
     ```

3. Crear tabla en Supabase:
   - Ejecutar el contenido de `setup_supabase.sql` en el panel SQL de Supabase

## Uso

Iniciar el servidor:
```bash
node server.js
```

El servidor escuchará en `http://localhost:3000`
Para usar el formulario web:
1. Asegúrate de que el servidor backend esté corriendo en `http://localhost:3000`
2. Abre el archivo `index.html` en tu navegador
3. Completa los campos requeridos
4. Haz clic en "Crear Cita"


## Endpoints

### GET /appointments

Obtiene todas las citas registradas.

### POST /appointments

Crea una nueva cita. El cuerpo debe contener:
```json
{
  "client_name": "Nombre del Cliente",
  "date": "2023-12-25",
  "time": "14:30:00",
  "service_type": "Tipo de Servicio"
}
```

#### Validaciones

- Todos los campos son requeridos
- No se permiten citas duplicadas para la misma fecha y hora (debido a la restricción UNIQUE en Supabase)

#### Respuestas

- `201 Created`: Cita creada exitosamente
- `400 Bad Request`: Campos faltantes o datos incompletos
- `409 Conflict`: Ya existe una cita para esa fecha y hora
- `500 Internal Server Error`: Error del servidor
