"use client";
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function ask(speak = false) {
    if (!question.trim()) return;
    setLoading(true);
    setTextAnswer("");
    setAudioUrl(null);

    const res = await fetch(`/api/ask?speak=${speak ? "1" : "0"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    setLoading(false);

    if (speak) {
      if (res.ok) {
        const blob = await res.blob();
        setAudioUrl(URL.createObjectURL(blob));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "TTS error.");
      }
    } else {
      if (res.ok) {
        const data = await res.json();
        setTextAnswer(data.answer);
      } else {
        const data = await res.json().catch(() => ({}));
        setTextAnswer(data?.message || "No answer found.");
      }
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bottle Support</h1>

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Ask a question… e.g. When is the next available bottle date?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={() => ask(false)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Asking…" : "Ask (Text)"}
        </button>

        <button
          onClick={() => ask(true)}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Speaking…" : "Ask (Voice)"}
        </button>
      </div>

      {textAnswer && (
        <p className="border rounded p-3 whitespace-pre-wrap">{textAnswer}</p>
      )}

      {audioUrl && <audio controls autoPlay src={audioUrl} className="w-full" />}
    </main>
  );
}
