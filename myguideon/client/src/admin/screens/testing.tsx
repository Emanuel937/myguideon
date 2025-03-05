import { useState } from "react";
import axios from "axios";

export default function Testing() {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const fetchToken = async () => {
        const token = localStorage.getItem("token");
        alert(token);
        
        try {
            const res = await axios.get("http://localhost:3030/api/test-auth", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResponse(res.data);
            setError(null);
        } catch (error) {
            console.log(error);
            setResponse(null);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Récupérer Token</h2>
            <button 
                onClick={fetchToken}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
                envoyer le Token
            </button>

        </div>
    );
}