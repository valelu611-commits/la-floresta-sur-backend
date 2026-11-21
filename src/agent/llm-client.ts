import type { AppEnv } from "../config/env.js";

export interface LlmClient {
  complete(system: string, user: string): Promise<string | null>;
}

interface ChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

/** Cliente OpenAI-compatible opcional. Sin clave, el agente usa reglas. */
export function createLlmClient(env: AppEnv): LlmClient | null {
  if (!env.llmApiKey || !env.llmProvider) return null;

  return {
    async complete(system: string, user: string): Promise<string | null> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${env.llmApiKey}`,
          },
          body: JSON.stringify({
            model: env.llmModel,
            temperature: 0.3,
            max_tokens: 500,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
          signal: controller.signal,
        });
        if (!response.ok) return null;
        const data = (await response.json()) as ChatResponse;
        return data.choices?.[0]?.message?.content?.trim() ?? null;
      } catch {
        return null;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
