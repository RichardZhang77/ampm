export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const qaPath = path.join(process.cwd(), "app/api/_data/qa.json");
const VOICE_ID = "CwhRBWXzGAHq8TQ4Fs17"; // ← replace with your ElevenLabs voice ID

async function readQA() {
  const buf = await fs.readFile(qaPath, "utf8");
  return JSON.parse(buf);
}

function findAnswer(question, qa) {
  const q = question.toLowerCase().trim();

  // substring match over keys
  for (const key of Object.keys(qa)) {
    if (q.includes(key)) return qa[key];
  }
  // exact match, if user typed the key verbatim
  if (qa[q]) return qa[q];

  return null;
}

export async function POST(request) {
  const { question } = await request.json();
  const url = new URL(request.url);
  const speak = url.searchParams.get("speak") === "1";

  if (!question) {
    return NextResponse.json({ error: "Missing 'question'." }, { status: 400 });
  }

  const qa = await readQA();
  const answer = findAnswer(question, qa);

  // No match
  if (!answer) {
    if (!speak) {
      return NextResponse.json({ answer: null, message: "No match found." }, { status: 404 });
    } else {
      // speak fallback via TTS
      const fallback = "Sorry, I don’t have an answer for that yet.";
      const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({ text: fallback })
      });
      if (!tts.ok) {
        return NextResponse.json({ error: "TTS failed." }, { status: 500 });
      }
      const audio = await tts.arrayBuffer();
      return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
    }
  }

  // Matched — return JSON or TTS audio
  if (!speak) {
    return NextResponse.json({ answer });
  }

  const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: answer,
      // optional settings:
      voice_settings: { stability: 0.7, similarity_boost: 0.7 }
    })
  });

  if (!tts.ok) {
    return NextResponse.json({ error: "TTS failed." }, { status: 500 });
  }

  const audio = await tts.arrayBuffer();
  return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
}
