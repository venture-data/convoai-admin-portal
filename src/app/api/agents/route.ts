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

    const formData = await request.formData();

    const url = `${process.env.BASE_URL}/elevenlabs/create-agent`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    // console.error('Detailed error:', {
    //   message: error instanceof Error ? error.message : 'Unknown error',
    //   stack: error instanceof Error ? error.stack : undefined
    // });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create agent' },
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
    const url = `${process.env.BASE_URL}/elevenlabs/get-agents`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();
    return NextResponse.json(data);

  }catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create agent' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    if (!process.env.BASE_URL) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const url = `${process.env.BASE_URL}/agent/update-agent`;
    const response = await fetch(url, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    // console.error('Update error:', {
    //   message: error instanceof Error ? error.message : 'Unknown error',
    //   stack: error instanceof Error ? error.stack : undefined
    // });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const formData = await request.formData();
    const agentId = formData.get('agent_id');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }   

    const url = `${process.env.BASE_URL}/agent/delete-agent`; 
    const response = await fetch(url, {
      method: 'DELETE',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  } 
}

