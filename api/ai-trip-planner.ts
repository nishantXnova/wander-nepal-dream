import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TripPlannerRequest {
  interest: string;
  duration: string;
  difficulty: string;
  budget: string;
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
    const { interest, duration, difficulty, budget } =
      req.body as TripPlannerRequest;

    const prompt = `You are an expert Nepal travel planner. Create a personalized trip itinerary based on these preferences:

Interests: ${interest || "General exploration"}
Duration: ${duration || "7 days"}
Difficulty Level: ${difficulty || "Moderate"}
Budget: ${budget || "Mid-range"}

Provide a detailed day-by-day itinerary with:
1. Destination name and brief description
2. Activities for each day
3. Recommended accommodations
4. Estimated costs in USD
5. Important tips for each location
6. Best time to visit recommendations

Format the response in a clear, structured way with markdown formatting.`;

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
          messages: [
            {
              role: "system",
              content:
                "You are an expert Nepal travel planner with deep knowledge of Nepali destinations, culture, trekking routes, and local customs. Provide helpful, accurate, and engaging travel advice.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const itinerary =
      data.choices?.[0]?.message?.content ||
      "Unable to generate itinerary";

    return res.status(200).json({ success: true, itinerary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return res.status(500).json({ success: false, error: message });
  }
}
