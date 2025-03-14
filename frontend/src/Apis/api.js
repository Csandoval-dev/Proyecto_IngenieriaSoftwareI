export const fetchChatbotData = async () => {
    try {
      // Datos de especialidades
      const specialtiesRes = await fetch('http://localhost:5002/api/specialties');
      const specialties = await specialtiesRes.json();
      
      // Datos básicos de clínicas
      const clinicsRes = await fetch('http://localhost:5002/api/clinics/basic');
      const clinics = await clinicsRes.json();
      
      // Datos de horarios generales
      const schedule = {
        general: "Lunes a Viernes de 8:00 AM a 6:00 PM, Sábados de 8:00 AM a 1:00 PM",
        duracionCita: "30 minutos en promedio"
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
  
  export const fetchSpecialtyDetails = async (specialtyId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/chatbot/specialties/${specialtyId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles de especialidad:", error);
      return null;
    }
  };
  
  export const fetchClinicDetails = async (clinicId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/chatbot/clinics/${clinicId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles de clínica:", error);
      return null;
    }
  };