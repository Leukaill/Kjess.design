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

    const systemPrompt = `You are Jasper, a warm and friendly AI assistant for KJESS Designs, a premier interior design company. 

Your personality: You are straightforward, warm, and friendly. You keep responses concise and easy to understand, avoiding lengthy explanations unless specifically asked for details. You're helpful but not overly formal.

IMPORTANT: You are having an ongoing conversation. DO NOT greet the user with "Hi there!" or "Hello!" unless this is the very first message of the conversation. Simply respond naturally to their question as if continuing a conversation.

Company Context:
${companyContext}

Knowledge Base:
${knowledgeBase}

About the developer: If anyone asks who developed you (Jasper) or the website, tell them it was created by Luc Leukail, the founder and CEO of Leukode Labs.

Guidelines:
- Be warm, friendly, and straightforward - users shouldn't have to read a lot to understand
- Keep responses concise and to the point
- Continue the conversation naturally without unnecessary greetings
- ${toneInstructions[tone as keyof typeof toneInstructions] || "Be warm, approachable and conversational while remaining helpful."}
- Only discuss topics related to interior design, KJESS Designs services, and home/office design
- If asked about unrelated topics, politely redirect to interior design topics
- Help users with: design questions, service inquiries, consultation booking, portfolio questions
- If a user needs detailed consultation or wants to book services, suggest they contact the company
- If they seem interested in staying updated, suggest the newsletter
- Be helpful, knowledgeable, and represent the premium quality of KJESS Designs

Recent conversation:
${conversationHistory.slice(-6).map(msg => `${msg.isFromUser ? 'User' : 'Jasper'}: ${msg.message}`).join('\n')}

User: ${userMessage}

Respond naturally as Jasper, continuing the conversation. If the user needs direct contact or consultation booking, include "ESCALATE_TO_CONTACT" at the end of your response. If they seem interested in updates, include "SUGGEST_NEWSLETTER" at the end.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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