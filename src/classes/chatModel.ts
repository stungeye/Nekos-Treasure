import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { BaseMessage } from "@langchain/core/messages";

type ChatModelInput = { input: string };
type ChatModelOutput = BaseMessage;

class ChatModel {
  private model: BaseChatModel;
  private chain: RunnableWithMessageHistory<ChatModelInput, ChatModelOutput>;
  private messageHistories: Record<string, InMemoryChatMessageHistory> = {};

  constructor(model: BaseChatModel, systemPrompt: string) {
    this.model = model;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(this.model);

    this.chain = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId: string) => {
        if (this.messageHistories[sessionId] === undefined) {
          this.messageHistories[sessionId] = new InMemoryChatMessageHistory();
        }
        return this.messageHistories[sessionId];
      },
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
  }

  async sendMessage(message: string, sessionId: string): Promise<BaseMessage> {
    const response = await this.chain.invoke(
      { input: message },
      { configurable: { sessionId } }
    );
    return response;
  }
}

export default ChatModel;
