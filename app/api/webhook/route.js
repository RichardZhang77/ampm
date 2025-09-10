// Simple in-memory storage for transcripts
let transcripts = [];

/**
 * Handle POST requests from ElevenLabs webhook
 * This is called when a conversation transcript or event is sent.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Debug log (will show in Vercel logs)
    console.log("📩 Full transcript payload:", JSON.stringify(body, null, 2));

    // Store transcript
    transcripts.push(body);

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return new Response("error", { status: 500 });
  }
}

/**
 * Handle GET requests
 * This lets the frontend fetch all stored transcripts.
 */
export async function GET() {
  return Response.json(transcripts);
}
