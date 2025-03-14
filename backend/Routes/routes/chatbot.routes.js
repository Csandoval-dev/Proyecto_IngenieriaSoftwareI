const express = require('express');
const router = express.Router();

// Importar el constructor de prompts
const { buildSystemPrompt } = require('../utils/promptBuilder');

// Función para obtener datos del chatbot
const fetchChatbotData = async () => {
  try {
    // Buscar especialidades en la base de datos
    const specialties = await require('../models/specialty.model').findAll();
    
    // Buscar clínicas en la base de datos
    const clinics = await require('../models/clinic.model').findBasicInfo(); // Ajusta según tu modelo

    const schedule = {
      general: "Lunes a Viernes de 8:00 AM a 6:00 PM, Sábados de 8:00 AM a 1:00 PM",
      duracionCita: "40 minutos en promedio"
    };
    
    return {
      especialidades: specialties || [],
      clinicas: clinics || [],
      horarios: schedule
    };
  } catch (error) {
    console.error("Error al obtener datos para el chatbot:", error);
    return { 
      especialidades: [], 
      clinicas: [],
      horarios: {
        general: "Lunes a Viernes de 8:00 AM a 6:00 PM",
        duracionCita: "30 minutos"
      }
    };
  }
};

// Endpoint para procesar mensajes
router.post('/message', async (req, res) => {
  try {
    const { messageHistory, newMessage, intent } = req.body;
    
    console.log("Recibido mensaje:", newMessage);
    console.log("Intención detectada:", intent);
    
    // Verificar la clave API
    if (!process.env.OPENAI_API_KEY) {
      console.error("No se encontró la clave de API de OpenAI");
      return res.status(500).json({ error: "API key no configurada en el servidor" });
    }
    
    // Obtener datos para el chatbot
    const chatbotData = await fetchChatbotData(); 
    
    // Construir el prompt del sistema
    const systemPrompt = buildSystemPrompt(chatbotData, intent);
    
    // Configurar la llamada a OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...messageHistory.slice(-6),
      { role: 'user', content: newMessage }
    ];
    
    console.log("Enviando mensaje a OpenAI:", JSON.stringify(messages));
    
    // Llamar a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la API de OpenAI (${response.status}):`, errorText);
      return res.status(500).json({ 
        error: `Error en la API de OpenAI: ${response.status}`, 
        details: errorText 
      });
    }
    
    const data = await response.json();
    console.log("Respuesta recibida de OpenAI");
    
    res.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error("Error al procesar mensaje:", error);
    res.status(500).json({ error: 'Error al procesar mensaje', details: error.message });
  }
});

module.exports = router;