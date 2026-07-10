import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { roomName, participantName } = await request.json();
    
    // In a real implementation we would use livekit-server-sdk
    // import { AccessToken } from 'livekit-server-sdk';
    // const at = new AccessToken('api-key', 'api-secret', { identity: participantName });
    // at.addGrant({ roomJoin: true, room: roomName });
    // const token = at.toJwt();
    
    // For now, return a mock token
    const token = "mock-livekit-token";

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
