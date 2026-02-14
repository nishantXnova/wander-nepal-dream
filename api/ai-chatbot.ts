import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotRequest {
  message: string;
  history?: ChatMessage[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [] } = req.body as ChatbotRequest;

    const messages = [
      {
        role: "system",
        content: `You are a friendly and knowledgeable Nepal travel assistant. You help travelers with:
- Information about destinations in Nepal (Kathmandu, Pokhara, Everest, Annapurna, etc.)
- Trekking advice, routes, and difficulty levels
- Visa and permit requirements
- Best times to visit different regions
- Local customs, culture, and etiquette
- Food recommendations
- Accommodation suggestions
- Safety tips and altitude sickness prevention
- Budget planning and cost estimates

Be concise but helpful. If you don't know something specific, suggest they check official sources.`,
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch(
      "https://gateway.ai.cloudflare.com/v1/vercel/ai-gateway/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not process your request.";

    return res.status(200).json({ success: true, reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return res.status(500).json({ success: false, error: message });
  }
}
