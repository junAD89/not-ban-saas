// app/api/check-user/route.js
import { checkIfUserIsBanned } from '@/lib/reddit';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    try {
        const userStatus = await checkIfUserIsBanned(username);
        return NextResponse.json(userStatus);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}