const express = require('express');
const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const { messageHistory, newMessage, intent } = req.body;
    
    // Construir el prompt del sistema
    const chatbotData = await fetchChatbotData(); // Implementa esta función
    const systemPrompt = buildSystemPrompt(chatbotData, intent);
    
    // Configurar la llamada a OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...messageHistory.slice(-6),
      { role: 'user', content: newMessage }
    ];
    
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
      throw new Error(`Error en la API: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar mensaje' });
  }
});

module.exports = router;