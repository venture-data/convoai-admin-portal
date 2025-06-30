import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { agent_id: string } }
) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
  
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Token is required' },
        { status: 401 }
      );
    }
  
    if (!process.env.BASE_URL) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { agent_id } = params;
    const url = `${process.env.BASE_URL}/api/v1/agent-knowledge/${agent_id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid or expired token' },
          { status: 401 }
        );
      }
      
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Request failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get agent knowledge bases' },
      { status: 500 }
    );
  }
} 