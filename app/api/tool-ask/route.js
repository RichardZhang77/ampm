export const runtime = "nodejs";
import { NextResponse } from "next/server";

const QA = {
  "when is the next available bottle date":
    "The next available bottle date is next Saturday at 11pm.",
};

function findAnswer(q) {
  const norm = q.toLowerCase().trim();
  for (const key of Object.keys(QA)) {
    if (norm.includes(key)) return QA[key];
  }
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get("q");

  if (!question) {
    return NextResponse.json({ error: "Missing 'q' query parameter." }, { status: 400 });
  }

  const answer = findAnswer(question);

  if (!answer) {
    return NextResponse.json({ answer: null, message: "No match found." }, { status: 404 });
  }

  return NextResponse.json({ answer });
}
