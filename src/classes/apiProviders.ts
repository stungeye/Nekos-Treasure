export enum ApiProviders {
  OpenAI = "OpenAI",
  Groq = "Groq",
  Google = "Google",
  Anthropic = "Anthropic",
}

export const ApiModels = {
  [ApiProviders.OpenAI]: [
    { name: "GPT-4o", value: "gpt-4o" },
    { name: "GPT-4o mini", value: "gpt-4o-mini" },
    { name: "GPT-3.5 Turbo", value: "gpt-3.5" },
  ],
  [ApiProviders.Groq]: [{ name: "Groq Model 1", value: "groq-model-1" }],
  [ApiProviders.Google]: [
    { name: "Gemini Model 1", value: "gemini-1" },
    { name: "Gemini Model 2", value: "gemini-2" },
  ],
  [ApiProviders.Anthropic]: [
    { name: "Claude v1", value: "claude-v1" },
    { name: "Claude v2", value: "claude-v2" },
  ],
} as const;
