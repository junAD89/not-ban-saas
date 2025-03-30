"use client";

import { useState } from "react";

export default function CheckPage() {
    const [user, setUser] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const verifier = async (username: string) => {
        if (!username.trim()) {
            setStatus('Veuillez entrer un nom d\'utilisateur valide.');
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(`/api/check-user?username=${username}`);
            const data = await response.json();
            if (response.ok) {
                setStatus(`✅ L'utilisateur ${username} est ${data.banned ? '🚫 banni' : '🟢 non banni'}`);
            } else {
                setStatus(`❌ Erreur : ${data.error || "Réponse invalide du serveur."}`);
            }
        } catch (error) {
            setStatus('❌ Erreur de requête. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Vérification d'utilisateur</h1>

            <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Nom d'utilisateur"
                style={{
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '250px',
                    display: 'block',
                    margin: '0 auto'
                }}
            />

            <button
                onClick={() => verifier(user)}
                disabled={loading}
                style={{
                    padding: '10px 15px',
                    backgroundColor: loading ? 'gray' : 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'block',
                    margin: '10px auto'
                }}
            >
                {loading ? 'Vérification...' : "Vérifier l'utilisateur"}
            </button>

            {loading && <p style={{ color: 'orange' }}>🔄 Vérification en cours...</p>}
            {status && <p style={{ color: status.includes('✅') ? 'green' : 'red' }}>{status}</p>}
        </div>
    );
}
