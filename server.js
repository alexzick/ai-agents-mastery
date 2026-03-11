// Simple Express proxy server for Feynman AI feedback
// Run with: node server.js
// The Vite dev server proxies /api/* to this server

import express from "express";

const app = express();
app.use(express.json());

app.post("/api/feynman", async (req, res) => {
  const { prompt, userText, apiKey } = req.body;

  if (!apiKey || !userText) {
    return res.status(400).json({ error: "Missing apiKey or userText" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a Socratic tutor teaching AI agents. Evaluate the student's Feynman explanation with warmth and precision. Return JSON only:
{
  "score": <1-10>,
  "understanding": "<one sentence on what they understood well>",
  "gap": "<the single most important concept they missed or explained poorly>",
  "hint": "<a concrete, actionable hint to improve their explanation without giving it away>",
  "encouragement": "<a brief motivating sentence>"
}`,
        messages: [
          {
            role: "user",
            content: `Prompt: "${prompt}"\n\nStudent's explanation:\n"${userText}"`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.content.map((b) => b.text || "").join("");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/judge-flashcard", async (req, res) => {
  const { question, correctAnswer, userAnswer, apiKey } = req.body;

  if (!apiKey || !userAnswer || !correctAnswer) {
    return res.status(400).json({ error: "Missing apiKey, userAnswer, or correctAnswer" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: `You are a flashcard answer judge for an AI agents learning system. Compare the student's answer to the correct answer. Be generous with approximate matches — if they captured the key idea, that counts. Return JSON only:
{
  "match": <"exact"|"close"|"partial"|"wrong">,
  "score": <0-5 where 0=blackout, 2=wrong but tried, 3=partial, 4=close, 5=exact>,
  "feedback": "<one brief sentence explaining the judgment>"
}`,
        messages: [
          {
            role: "user",
            content: `Question: "${question}"\n\nCorrect answer: "${correctAnswer}"\n\nStudent's answer: "${userAnswer}"`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.content.map((b) => b.text || "").join("");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/tts", async (req, res) => {
  const { text, apiKey, voiceId = "21m00Tcm4TlvDq8ikWAM" } = req.body;

  if (!apiKey || !text) {
    return res.status(400).json({ error: "Missing apiKey or text" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    res.set("Content-Type", "audio/mpeg");
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, system, apiKey } = req.body;

  if (!apiKey || !messages || !messages.length) {
    return res.status(400).json({ error: "Missing apiKey or messages" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: system || "You are a helpful AI study assistant for learning about AI agents.",
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.content.map((b) => b.text || "").join("");
    res.json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Feynman API proxy running on http://localhost:${PORT}`);
});
