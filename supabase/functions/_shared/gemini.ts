import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ?? "");

const MODEL = "gemini-2.0-flash";

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateJson<T>(prompt: string, systemPrompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt + "\n\nRespond with valid JSON only, no markdown formatting.",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
  return JSON.parse(text) as T;
}

export async function analyzeImage(base64Image: string, mimeType: string, prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
  });
  const imagePart = { inlineData: { data: base64Image, mimeType } };
  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text();
}
