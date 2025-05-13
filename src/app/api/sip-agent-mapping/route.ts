import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
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

    const token = authHeader.split(' ')[1];
    if (!process.env.BASE_URL) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/sip-agent-mapping`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `refresh_token=${refreshToken.value}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SIP agent mapping retrieval error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('SIP agent mapping retrieval error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve SIP agent mapping' },
      { status: 500 }
    );
  }
} 