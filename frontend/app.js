import React, { useEffect, useState } from "react";
import { testBackendConnection } from "../services/index";

function App() {
    const [message, setMessage] = useState("Conectando...");

    useEffect(() => {
        testBackendConnection().then((data) => {
            if (data.error) {
                setMessage("❌ Error en la conexión con el backend");
            } else {
                setMessage(`✅ ${data.message} - Hora del servidor: ${data.time.now}`);
            }
        });
    }, []);

    return (
        <div>
            <h1>Prueba de conexión con el Backend</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
