import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
let model;

const initGemini = () => {
  if (API_KEY) {
    console.log("Initializing Gemini with API Key...");
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  } else {
    console.warn("VITE_GEMINI_API_KEY is missing in .env file");
  }
};

initGemini();

export const getGeminiResponse = async (prompt, contextData = "") => {
  if (!model) {
    initGemini();
    if (!model) {
      throw new Error(
        "Gemini API Key is missing. Please check your .env file and restart the server."
      );
    }
  }

  try {
    const systemPrompt = `You are VortixAI, an expert cryptocurrency assistant for the Vortix portfolio management platform. 
        
        Your role is to help users with cryptocurrency decisions, explain concepts, and provide insights based on the available market data.
        
        Style: Professional, helpful, concise, and enthusiastic about crypto.
        Theme: You relate things to the "Vortix" ecosystem.
        
        Context Data (Current Market Info):
        ${contextData}
        
        User Question: ${prompt}
        
        Provide a helpful answer. If advising on "best crypto to buy", clearly state you are an AI and this is not financial advice, but provide analysis based on the data allowed (e.g. detailed volume, market cap, and change trends).`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error Details:", error);

    if (error.message?.includes("API key not valid")) {
      throw new Error(
        "Invalid API Key. Please check your VITE_GEMINI_API_KEY in .env"
      );
    }
    if (error.message?.includes("fetch failed")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(
      `Gemini Error: ${error.message || "Unknown error occurred"}`
    );
  }
};
