import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    answer: "The next available bottle service date is next Saturday at 11pm.",
  });
}
