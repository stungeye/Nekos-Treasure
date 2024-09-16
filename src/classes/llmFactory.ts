import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ApiProviders, ApiModel } from "./apiProviders";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export function createLlm(
  provider: ApiProviders,
  temperature: number,
  model: ApiModel,
  apiKey: string
): BaseChatModel {
  const config = { temperature, model, apiKey };

  switch (provider) {
    case ApiProviders.OpenAI:
      return new ChatOpenAI(config);
    case ApiProviders.Groq:
      return new ChatGroq(config);
    case ApiProviders.Google:
      return new ChatGoogleGenerativeAI(config);
    case ApiProviders.Anthropic:
      return new ChatAnthropic(config);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
