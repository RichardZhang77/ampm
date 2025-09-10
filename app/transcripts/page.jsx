"use client";
import { useEffect, useState } from "react";

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    fetch("/api/webhook")
      .then((res) => res.json())
      .then((data) => setTranscripts(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Call Transcripts</h1>

      {transcripts.length === 0 ? (
        <p>No transcripts yet...</p>
      ) : (
        transcripts.map((t, i) => (
          <div key={i} className="border p-4 mb-2 rounded">
         <p><b>Conversation ID:</b> {t.conversation_id || "N/A"}</p>

{/* Handle both "messages" or "transcript" */}
{(t.messages || t.transcript)?.map((m, j) => (
  <p key={j}>
    <b>{m.role || m.speaker}:</b> {m.text}
  </p>
))}
          </div>
        ))
      )}
    </div>
  );
}
