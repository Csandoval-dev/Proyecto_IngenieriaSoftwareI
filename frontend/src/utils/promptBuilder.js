// frontend/src/components/Chatbot/utils/promptBuilder.js
export const buildSystemPrompt = (data, intent) => {
    const { especialidades, clinicas, horarios } = data;
    
    let prompt = `Eres un asistente virtual de Health Connect, un sistema de gestión médica que conecta pacientes con médicos y clínicas.
  
  SOBRE HEALTH CONNECT:
  - Health Connect facilita la programación de citas médicas entre pacientes y médicos de diversas especialidades.
  - El sistema trabaja con clínicas tanto públicas como privadas.
  - Los pacientes pueden registrarse para agendar citas médicas.
  
  HORARIOS DE ATENCIÓN:
  ${horarios.general || "Lunes a Viernes de 8:00 AM a 6:00 PM"}
  - Duración promedio de citas: ${horarios.duracionCita || "30 minutos"}
  
  INSTRUCCIONES:
  1. Responde amablemente preguntas sobre Health Connect.
  2. Brinda información sobre especialidades, procesos de reserva de citas y servicios.
  3. NO proporciones diagnósticos médicos ni tratamientos.
  4. Mantén un tono profesional pero cálido y empático.`;
  
    // Agregar especialidades si están disponibles
    if (especialidades && especialidades.length > 0) {
      prompt += `\n\nESPECIALIDADES DISPONIBLES:
  ${especialidades.map(e => e.nombre || e).join(', ')}`;
    }
    
    // Agregar clínicas si están disponibles
    if (clinicas && clinicas.length > 0) {
      prompt += `\n\nCLÍNICAS ASOCIADAS:
  ${clinicas.map(c => `${c.nombre} (${c.tipo || 'N/A'})`).join(', ')}`;
    }
    
    // Agregar información sobre la intención detectada
    if (intent && intent !== 'general_inquiry') {
      prompt += `\n\nINTENCIÓN DETECTADA: El usuario está preguntando sobre ${
        intent === 'appointment_scheduling' ? 'cómo agendar una cita' :
        intent === 'doctor_search' ? 'información sobre médicos o especialidades' :
        intent === 'pricing' ? 'precios o costos de servicios' :
        intent === 'schedule_inquiry' ? 'horarios disponibles' : 
        intent === 'clinic_info' ? 'información sobre clínicas' :
        'información general'
      }.`;
    }
    
    return prompt;
  };