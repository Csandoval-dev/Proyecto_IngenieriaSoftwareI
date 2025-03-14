export const detectUserIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (/cita|agendar|reservar|programar/.test(lowerMessage)) {
    return 'appointment_scheduling';
  }
  
  if (/especialidad|especialista|doctor|médico/.test(lowerMessage)) {
    return 'doctor_search';
  }
  
  if (/precio|costo|tarifa|pagar/.test(lowerMessage)) {
    return 'pricing';
  }
  
  if (/horario|disponibilidad|cuando|qué días/.test(lowerMessage)) {
    return 'schedule_inquiry';
  }
  
  if (/clínica|centro|hospital|sede/.test(lowerMessage)) {
    return 'clinic_info';
  }
  
  return 'general_inquiry';
};

export const enrichContextWithData = async (message, chatbotData) => {
  // Implementación de la función para obtener datos contextuales
  // basados en la consulta del usuario
  let contextualInfo = {};
  
  // ... implementación aquí ...
  
  return contextualInfo;
};