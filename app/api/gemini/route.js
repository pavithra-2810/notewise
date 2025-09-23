import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
    });

    const result = await chat.sendMessage(prompt);
    const text = await result.response.text();

    return NextResponse.json({ result: text });
  } catch (err) {
    console.error("[Gemini API Error]", err);
    return NextResponse.json(
      { error: "Gemini API request failed", details: err.message },
      { status: 500 }
    );
  }
}





