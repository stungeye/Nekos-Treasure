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
  [ApiProviders.Groq]: [
    { name: "Groq Llama 3.3 70b Versatile", value: "llama-3.3-70b-versatile" },
    {
      name: "DeepSeek R1 Llama Distill",
      value: "deepseek-r1-distill-llama-70b",
    },
    { name: "Qwen 2.5 32b", value: "qwen-2.5-32b" },
  ],
  [ApiProviders.Google]: [
    { name: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
    { name: "Gemini 2.0 Flash Lite", value: "gemini-2.0-flash-lite" },
  ],
  [ApiProviders.Anthropic]: [
    { name: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" },
    { name: "Claude 3 Opus", value: "claude-3-opus-20240229" },
    { name: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
  ],
} as const;

export type ApiModel = (typeof ApiModels)[ApiProviders][number]["value"];
