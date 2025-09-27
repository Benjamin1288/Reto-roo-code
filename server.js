const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Appointment Booker funcionando');
});


// Middleware para manejo de errores general
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ocurrió un error inesperado en el servidor'
  });
});

// Ruta POST para crear una nueva cita
app.post('/appointments', async (req, res) => {
  const { client_name, date, time, service_type } = req.body;

  // Validación de campos requeridos
  if (!client_name || !date || !time || !service_type) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Todos los campos son requeridos: client_name, date, time, service_type',
      required_fields: ['client_name', 'date', 'time', 'service_type']
    });
  }

  try {
    // Verificar si ya existe una cita en la misma fecha y hora
    const { data: existingAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .single();

    if (existingAppointment) {
      return res.status(409).json({
        error: 'Cita duplicada',
        message: 'Ya existe una cita para esta fecha y hora',
        conflict_date: date,
        conflict_time: time
      });
    }

    // Insertar la nueva cita
    const { data, error, status } = await supabase
      .from('appointments')
      .insert([{ client_name, date, time, service_type }])
      .select();

    if (error) {
      console.error('Error al crear cita:', error);
      // Verificar si es un error de restricción UNIQUE
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Cita duplicada',
          message: 'Ya existe una cita para esta fecha y hora',
          conflict_date: date,
          conflict_time: time
        });
      }
      return res.status(status || 500).json({
        error: 'Error al crear cita',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Cita creada exitosamente',
      appointment: data[0]
    });
  } catch (err) {
    if (err.message.includes('already exists')) {
      // Capturar el error de duplicado de UNIQUE constraint
      return res.status(409).json({
        error: 'Cita duplicada',
        message: 'Ya existe una cita para esta fecha y hora',
        conflict_date: date,
        conflict_time: time
      });
    }
    
    console.error('Error en el servidor:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al procesar la solicitud'
    });
  }
});

// Ruta GET para listar citas
app.get('/appointments', async (req, res) => {
  try {
    const { data, error, status } = await supabase
      .from('appointments')
      .select('*');
    
    if (error) {
      console.error('Error al obtener citas:', error);
      return res.status(status || 500).json({
        error: 'Error al obtener citas',
        details: error.message
      });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al procesar la solicitud'
    });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});