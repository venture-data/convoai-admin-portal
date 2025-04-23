import { setCookies } from '@/lib/set-cookies';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    if (!refreshToken?.value) {
      return NextResponse.json(
        { error: 'Refresh token missing in cookies' },
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
    const response = await fetch(`${process.env.BASE_URL}/api/v1/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `refresh_token=${refreshToken.value}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Refresh error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      await setCookies([setCookieHeader]);
    }
    return NextResponse.json({
      access_token: data.access_token,
      token: data.access_token,
      isAuth: true
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh token' },
      { status: 500 }
    );
  }
} 