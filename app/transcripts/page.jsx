"use client";
import { useEffect, useState } from "react";

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/webhook");
        const data = await res.json();
        setTranscripts(data);
      } catch (err) {
        console.error("❌ Error fetching transcripts:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Call Transcripts</h1>

      {transcripts.length === 0 ? (
        <p>No transcripts yet...</p>
      ) : (
        transcripts.map((t, i) => (
          <div
            key={i}
            className="border p-4 mb-2 rounded bg-white shadow space-y-2"
          >
            {/* Try multiple ID fields */}
            <p>
              <b>Conversation ID:</b>{" "}
              {t.conversation_id || t.call_id || t.id || "N/A"}
            </p>

            {/* Try messages or transcript arrays */}
            {(t.messages || t.transcript)?.map((m, j) => (
              <p key={j}>
                <b>{m.role || m.speaker || "unknown"}:</b> {m.text}
              </p>
            ))}

            {/* Fallback: show raw JSON */}
            {!t.messages && !t.transcript && (
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                {JSON.stringify(t, null, 2)}
              </pre>
            )}
          </div>
        ))
      )}
    </div>
  );
}
