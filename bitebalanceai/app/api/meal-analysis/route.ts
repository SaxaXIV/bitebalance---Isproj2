import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type MealItem = {
  name: string;
  quantity: number;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mealType, items, totalServings } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Meal items are required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 400 }
      );
    }

    // Build meal description
    const mealDescription = items.map((item: MealItem) => {
      const parts = [item.name, `${item.quantity} serving(s)`];
      if (item.protein !== null) parts.push(`${item.protein}g protein`);
      if (item.carbs !== null) parts.push(`${item.carbs}g carbs`);
      if (item.fat !== null) parts.push(`${item.fat}g fat`);
      parts.push(`${item.calories} calories`);
      return `- ${parts.join(", ")}`;
    }).join("\n");

    const totalCalories = items.reduce((sum: number, item: MealItem) => sum + (item.calories * item.quantity), 0);
    const totalProtein = items.reduce((sum: number, item: MealItem) => sum + ((item.protein || 0) * item.quantity), 0);
    const totalCarbs = items.reduce((sum: number, item: MealItem) => sum + ((item.carbs || 0) * item.quantity), 0);
    const totalFat = items.reduce((sum: number, item: MealItem) => sum + ((item.fat || 0) * item.quantity), 0);

    const systemPrompt = `You are a nutrition impact analyst. Analyze the meal composition and provide a brief, accessible analysis.

Format your response as JSON with exactly these fields:
{
  "cause": "Brief 1-sentence analysis of key nutritional issue",
  "result": "Brief 2-sentence description of health impact and symptoms"
}

Be specific about macros provided. Keep language accessible and actionable. Focus on practical health implications.`;

    const userPrompt = `Analyze this ${mealType} meal:

${mealDescription}

Total: ${totalCalories} calories, ${totalProtein.toFixed(1)}g protein, ${totalCarbs.toFixed(1)}g carbs, ${totalFat.toFixed(1)}g fat
Total servings: ${totalServings || 1}

Provide your analysis in the requested JSON format.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const aiResult = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const response = await aiResult.response;
    let text = response.text();

    // Try to extract JSON from the response
    try {
      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Try to find JSON object in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          cause: parsed.cause || "Meal composition analyzed.",
          result: parsed.result || "This meal provides energy and nutrients to support your daily activities.",
        });
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
    }

    // Fallback: parse text response manually
    const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
    let cause = "Meal composition analyzed.";
    let resultText = "This meal provides energy and nutrients to support your daily activities.";

    // Try to find cause and result in text
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes("cause") || lines[i].toLowerCase().includes("issue")) {
        cause = lines[i + 1] || cause;
      }
      if (lines[i].toLowerCase().includes("result") || lines[i].toLowerCase().includes("impact")) {
        resultText = (lines[i + 1] || "") + " " + (lines[i + 2] || "");
        break;
      }
    }

    return NextResponse.json({ cause, result: resultText });
  } catch (error: any) {
    console.error("Meal analysis API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze meal",
        cause: "Unable to analyze meal at this time.",
        result: "Please try again later."
      },
      { status: 500 }
    );
  }
}
