// Fonction pour obtenir le token d'accès Reddit
async function getRedditAccessToken() {
    try {
        console.log('Tentative d\'obtention du token Reddit...');

        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64'),
                'User-Agent': 'script:NotBan:v1.0.0 (by /u/your_reddit_username)'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'device_id': 'DO_NOT_TRACK_THIS_DEVICE'
            }).toString()
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse Reddit non-OK:', errorText);
            console.error('Status code:', response.status);
            console.error('Headers envoyés:', {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + '[REDACTED]',
                'User-Agent': 'script:NotBan:v1.0.0 (by /u/your_reddit_username)'
            });
            throw new Error(`Échec de l'authentification Reddit: ${errorText}`);
        }

        const data = await response.json();
        console.log('Token obtenu avec succès:', !!data.access_token);
        return data.access_token;
    } catch (error) {
        console.error('Erreur d\'authentification Reddit:', error);
        throw error;
    }
}

// Fonction pour vérifier si un utilisateur est banni
export async function checkIfUserIsBanned(username) {
    try {
        const accessToken = await getRedditAccessToken();

        const response = await fetch(`https://oauth.reddit.com/user/${username}/about`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'NotBan/1.0.0 (by /u/your_reddit_username)'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            // Si l'utilisateur n'existe pas ou est banni, Reddit renvoie généralement une erreur 404
            if (response.status === 404) {
                return { exists: false, banned: true };
            }
            const errorData = await response.json();
            throw new Error(`Erreur API Reddit: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();

        // Si le compte existe et a une propriété "is_suspended" à true, l'utilisateur est banni
        // Ou si "is_banned" est présent et true
        const isBanned = data.data.is_suspended === true || data.data.is_banned === true;

        return {
            exists: true,
            banned: isBanned,
            userData: data.data
        };
    } catch (error) {
        console.error(`Erreur lors de la vérification du statut de l'utilisateur ${username}:`, error);
        throw error;
    }
}