export async function checkIfUserIsBanned(username) {
    try {
        const accessToken = await getRedditAccessToken();

        const response = await fetch(`https://oauth.reddit.com/user/${username}/about`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'MyApp/1.0.0'
            },
            cache: 'no-store'
        });

        const data = await response.json();

        if (!response.ok) {
            // Si l'utilisateur n'existe pas ou est banni, Reddit renvoie généralement une erreur 404
            if (response.status === 404) {
                return { exists: false, banned: true };
            }
            throw new Error(`Erreur API Reddit: ${data.error}`);
        }

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