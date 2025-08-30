import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  message: string;
  shouldEscalate?: boolean;
  suggestedAction?: 'contact' | 'consultation' | 'newsletter';
}

export async function generateChatResponse(
  userMessage: string,
  conversationHistory: Array<{ message: string; isFromUser: boolean }>,
  companyContext: string,
  knowledgeBase: string,
  tone: string = "professional"
): Promise<ChatResponse> {
  try {
    const toneInstructions = {
      professional: "Respond professionally and formally, using business language.",
      friendly: "Be warm, approachable and conversational while remaining helpful.",
      casual: "Use a relaxed, informal tone like talking to a friend."
    };

    const systemPrompt = `You are an AI assistant for KJESS Designs, a premier interior design company. 

Company Context:
${companyContext}

Knowledge Base:
${knowledgeBase}

Guidelines:
- ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}
- Only discuss topics related to interior design, KJESS Designs services, and home/office design
- If asked about unrelated topics, politely redirect to interior design topics
- Help users with: design questions, service inquiries, consultation booking, portfolio questions
- If a user needs detailed consultation or wants to book services, suggest they contact the company
- If they seem interested in staying updated, suggest the newsletter
- Be helpful, knowledgeable, and represent the premium quality of KJESS Designs

Recent conversation:
${conversationHistory.slice(-6).map(msg => `${msg.isFromUser ? 'User' : 'Assistant'}: ${msg.message}`).join('\n')}

Current user message: ${userMessage}

Respond helpfully and naturally. If the user needs direct contact or consultation booking, include "ESCALATE_TO_CONTACT" at the end of your response. If they seem interested in updates, include "SUGGEST_NEWSLETTER" at the end.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    const responseText = response.text || "I apologize, but I'm having trouble responding right now. Please try again or contact us directly.";
    
    // Check for escalation flags
    const shouldEscalate = responseText.includes("ESCALATE_TO_CONTACT");
    const suggestNewsletter = responseText.includes("SUGGEST_NEWSLETTER");
    
    // Clean the response
    const cleanedMessage = responseText
      .replace("ESCALATE_TO_CONTACT", "")
      .replace("SUGGEST_NEWSLETTER", "")
      .trim();

    return {
      message: cleanedMessage,
      shouldEscalate,
      suggestedAction: shouldEscalate ? 'contact' : suggestNewsletter ? 'newsletter' : undefined
    };
  } catch (error) {
    console.error("Failed to generate chat response:", error);
    return {
      message: "I apologize, but I'm experiencing technical difficulties. Please contact us directly for assistance with your interior design needs.",
      shouldEscalate: true,
      suggestedAction: 'contact'
    };
  }
}