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
    
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/v1/outbound-call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cookie': `refresh_token=${refreshToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      if (!response.ok) {
        // Handle timeout errors (504) as success
        if (response.status === 504) {
          console.log("Outbound call timed out, but request was likely received");
          return NextResponse.json({
            success: true,
            message: "Your request has been sent and is being processed"
          });
        }
        
        const errorText = await response.text();
        console.error("Outbound call error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
   
      console.log("response inside route");
      console.log(response);

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      if (error instanceof Error && 
         (error.message.includes('timeout') || 
          error.message.includes('network') || 
          error.message.includes('failed to fetch'))) {
        console.log("Network/timeout error for outbound call, but request might have been received");
        return NextResponse.json({
          success: true,
          message: "Your request has been sent and is being processed"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Outbound call error:', error);
    
    if (error instanceof Error && 
       (error.message.includes('504') || 
        error.message.includes('timeout') || 
        error.message.includes('timed out'))) {
      return NextResponse.json({
        success: true,
        message: "Your request has been sent and is being processed"
      });
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate outbound call' },
      { status: 500 }
    );
  }
} 