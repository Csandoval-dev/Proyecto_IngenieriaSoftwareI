import React, { useEffect, useState } from "react";
import { testBackendConnection } from "./index";

function App() {
    const [message, setMessage] = useState("Connecting...");

    useEffect(() => {
        testBackendConnection().then((data) => {
            if (data.error) {
                setMessage("❌ Error connecting to the backend");
            } else {
                setMessage(`✅ ${data.message} - Server time: ${data.time.now}`);
            }
        });
    }, []);

    return (
        <div>
            <h1>Backend Connection Test</h1>
            <p>{message}</p>
        </div>
    );
}

export default app;