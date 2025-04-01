import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse request body
    const { records } = body;

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: "No medical records provided." },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, // Ensure this is set in .env.local
    });

    const prompt = `Summarize the following patient medical history:\n\n${JSON.stringify(
      records,
      null,
      2
    )}`;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      summary: response.content || "No summary available.",
    });
  } catch (error) {
    console.error("Error summarizing records:", error);
    return NextResponse.json(
      { error: "Failed to summarize medical records." },
      { status: 500 }
    );
  }
}
