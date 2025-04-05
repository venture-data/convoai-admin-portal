import { setCookies } from '@/lib/set-cookies';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const authCookies = request.headers.get('cookie');

    console.log("header token")
    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.BASE_URL) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    console.log("final token")
    console.log(token)
    const response = await fetch(`${process.env.BASE_URL}/api/v1/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': authCookies || '',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    const setCookieHeader = response.headers.get('set-cookie');
    const nextResponse = NextResponse.json(data);
    if (setCookieHeader) {
      await setCookies(setCookieHeader?[setCookieHeader]:undefined)
    }

    return nextResponse;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh token' },
      { status: 500 }
    );
  }
} 