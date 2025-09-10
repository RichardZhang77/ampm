// In-memory transcript storage
let transcripts = [];

export async function POST(req) {
  const body = await req.json();

  transcripts.push(body);

  console.log("📩 Transcript webhook received:", body);

  return new Response("ok", { status: 200 });
}

export async function GET() {
  // Return all stored transcripts
  return Response.json(transcripts);
}
