import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

const gemini = google("models/gemini-1.5-flash");
const llama = groq("llama-3.1-70b-versatile");

export { gemini, llama };
