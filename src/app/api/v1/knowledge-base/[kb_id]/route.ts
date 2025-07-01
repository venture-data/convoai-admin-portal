import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ kb_id: string }> }
) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Token is required' },
        { status: 401 }
      );
    }

    if (!process.env.BASE_URL) {
      console.error('BASE_URL environment variable is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { kb_id } = await params;
    const url = `${process.env.BASE_URL}/api/v1/knowledge-base/${kb_id}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
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

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete knowledge base' },
      { status: 500 }
    );
  }
} 