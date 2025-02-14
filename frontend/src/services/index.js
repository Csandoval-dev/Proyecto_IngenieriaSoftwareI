const API_URL = "http://localhost:5000/api/test"; // Asegúrate de que el backend esté corriendo

export const testBackendConnection = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        return { error: "No se pudo conectar con el backend" };
    }
};
