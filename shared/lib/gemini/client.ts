import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Returns a singleton Gemini client.
 * Only use server-side (API routes) — API key must stay secret.
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  return geminiClient;
}

/**
 * Get the flash model — fast and cost-effective for analysis.
 */
export function getGeminiFlashModel() {
  return getGeminiClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });
}

/**
 * Build the analysis prompt for grading a student's answer.
 */
export function buildAnalysisPrompt(
  questionBody: string,
  studentAnswer: string,
  correctAnswer: string
): string {
  return `You are an expert Class 12 Mathematics teacher evaluating a student's answer for JEE/NEET preparation (Indian curriculum, NCERT-aligned).

**Question:**
${questionBody}

**Student's Answer (submitted in Markdown):**
${studentAnswer || "(No answer provided)"}

**Reference Answer:**
${correctAnswer}

**Your Task:**
Evaluate the student's answer thoroughly and respond ONLY with a valid JSON object in this exact schema:

{
  "gemini_score": <number between 0 and 10, one decimal place>,
  "approach_breakdown": "<Markdown string: analyze the student's approach step by step, highlight what they got right (✅) and what they missed (❌). Be specific about mathematical steps.>",
  "feedback": "<Markdown string: constructive, encouraging feedback. For Indian Class 12 students. Mention specific concepts to review, common JEE/NEET pitfalls, and how to improve. Keep it motivating.>",
  "correct_answer_hint": "<Markdown string: a concise explanation of the correct approach/answer. Do not just copy-paste — explain the key insight.>"
}

**Scoring Rubric (gemini_score):**
- 9-10: Fully correct, clear method, correct answer
- 7-8: Mostly correct, minor errors in steps or final answer
- 5-6: Correct approach but significant computational errors
- 3-4: Partially correct, right idea but major gaps
- 1-2: Attempted but fundamentally incorrect approach
- 0: No meaningful attempt or completely wrong

Respond ONLY with the JSON object. No extra text.`;
}
