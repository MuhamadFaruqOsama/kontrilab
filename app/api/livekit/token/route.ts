import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LiveKitGrant = {
  roomJoin: boolean;
  room: string;
  canPublish: boolean;
  canSubscribe: boolean;
  canPublishData: boolean;
};

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function signLiveKitToken({ roomName, participantName }: { roomName: string; participantName: string }) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("LIVEKIT_API_KEY dan LIVEKIT_API_SECRET belum dikonfigurasi.");
  }

  const now = Math.floor(Date.now() / 1000);
  const grant: LiveKitGrant = {
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: apiKey,
    sub: participantName,
    nbf: now - 10,
    exp: now + 60 * 60,
    jti: randomUUID(),
    video: grant,
  };
  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = createHmac("sha256", apiSecret).update(unsignedToken).digest();
  return `${unsignedToken}.${base64Url(signature)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const roomName = String(body?.roomName ?? "").trim();
    const participantName = String(body?.participantName ?? body?.identity ?? "").trim();

    if (!roomName) return NextResponse.json({ error: "Nama room wajib dikirim." }, { status: 400 });
    if (!participantName) return NextResponse.json({ error: "Nama peserta wajib dikirim." }, { status: 400 });

    const token = signLiveKitToken({ roomName, participantName });
    return NextResponse.json({ token, url: process.env.NEXT_PUBLIC_LIVEKIT_URL ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("LiveKit token API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}