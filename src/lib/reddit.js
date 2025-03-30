// First, add the getRedditAccessToken function
async function getRedditAccessToken() {
    // You'll need to implement this with your Reddit API credentials
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

// Then your existing function
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