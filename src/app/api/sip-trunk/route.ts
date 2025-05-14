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

    const body = await request.json();
    const { ...apiRequestBody } = body;

    const response = await fetch(`${process.env.BASE_URL}/api/v1/sip-trunk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `refresh_token=${refreshToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiRequestBody),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SIP trunk creation error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('SIP trunk creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create SIP trunk' },
      { status: 500 }
    );
  }
} 

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

    const response = await fetch(`${process.env.BASE_URL}/api/v1/sip-trunk`, {
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
      console.error("SIP trunk retrieval error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('SIP trunk retrieval error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve SIP trunk' },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
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

    const body = await request.json();
    console.log(body);
    const response = await fetch(`${process.env.BASE_URL}/api/v1/sip-trunk/${body.id}/agent-mapping`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `refresh_token=${refreshToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: body.agent_id,
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SIP trunk update error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('SIP trunk update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update SIP trunk' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    // Get the ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const response = await fetch(`${process.env.BASE_URL}/api/v1/sip-trunk/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': `refresh_token=${refreshToken.value}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SIP trunk deletion error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('SIP trunk deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete SIP trunk' },
      { status: 500 }
    );
  }
}


