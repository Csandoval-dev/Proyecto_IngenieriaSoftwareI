import { buildSystemPrompt } from '../utils/promptBuilder';

export const getAIResponse = async (messageHistory, newMessage, chatbotData, intent) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("API key no configurada");
  }

  // Construir el prompt del sistema
  const systemPrompt = buildSystemPrompt(chatbotData, intent);
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...messageHistory.slice(-6), 
    { role: 'user', content: newMessage }
  ];

  // Realizar la llamada a la API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
  return data.choices[0].message.content;
};