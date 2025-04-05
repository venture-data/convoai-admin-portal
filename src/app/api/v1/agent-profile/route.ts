import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
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

    const data = await request.json();
    const url = `${process.env.BASE_URL}/api/v1/agent-profile`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
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
      { error: error instanceof Error ? error.message : 'Failed to create agent profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
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
    const url = `${process.env.BASE_URL}/api/v1/agent-profile`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
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
      { error: error instanceof Error ? error.message : 'Failed to fetch agent profiles' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    const { searchParams } = new URL(request.url);
    const agent_id = searchParams.get('agent_id');

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

    const data = await request.json();
    const url = `${process.env.BASE_URL}/api/v1/agent-profile/${agent_id}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
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
      { error: error instanceof Error ? error.message : 'Failed to update agent profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    const { searchParams } = new URL(request.url);
    const agent_id = searchParams.get('agent_id');

    console.log("Processing DELETE request for agent:", agent_id);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.BASE_URL) {
      console.error('BASE_URL environment variable is not defined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    const url = `${process.env.BASE_URL}/api/v1/agent-profile/${agent_id}`;
    console.log("Sending DELETE request to:", url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': headersList.get('cookie') || ''
      },
      credentials: 'include'
    });
    
    console.log("Delete response status:", response.status);

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      console.error('Received HTML response instead of JSON');
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      );
    }

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText || 'Unknown error' };
      }
      
      return NextResponse.json(
        { error: errorData.detail || 'Request failed' },
        { status: response.status }
      );
    }

    return new Response(null, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete agent profile' },
      { status: 500 }
    );
  }
} 