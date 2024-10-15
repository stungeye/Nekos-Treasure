import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatModel from "@/classes/chatModel";
import { createLlm } from "@/classes/llmFactory";
import LocalStorageStore from "@/classes/localStorageStore";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { levelManager, LevelConfig } from "@/classes/levelConfig";
import { parseLLMResponse } from "@/classes/llmResponseParser";

interface GameUIProps {
  apiSettingsSet: boolean;
}

const GameUI: React.FC<GameUIProps> = ({ apiSettingsSet }) => {
  // Component state:
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false); // Track whether chat is enabled
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig>(
    levelManager.getCurrentLevelConfig()
  );
  const [secretWord, setSecretWord] = useState<string>("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(
    currentLevelConfig.attempts
  );

  // Reference and local storage state:
  const store = new LocalStorageStore("neko-api-settings");
  const chatModelRef = useRef<ChatModel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for the ScrollArea

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView(false); // Auto-scroll to bottom
    }
  }, [messages]); // Run whenever `messages` array is updated

  // After AI response, focus the input field
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus(); // Focus the input element
    }
  }, [isLoading]); // Focus input after loading is finished

  // Initialize the chat model when API settings are set
  useEffect(() => {
    setMessages([]); // Clear messages when API settings are updated

    if (!apiSettingsSet) {
      setIsChatEnabled(false); // No chating if API settings are not set
      return; // Don't initialize if API settings are not set
    }

    setIsChatEnabled(true);
    const provider = store.get("provider");
    const model = store.get("model");
    const apiKey = store.get("apiKey");

    const initChatModel = async () => {
      const llm = createLlm(provider, 0.7, model, apiKey);
      const newSecretWord = levelManager.getSecretWord();
      console.log("Secret word:", newSecretWord);
      setSecretWord(newSecretWord);
      chatModelRef.current = new ChatModel(
        llm,
        levelManager.getSystemMessage()
      );
    };

    // Initialize the chat model and send a welcome message to kick off the conversation.
    // From the ai's perspective, the welcome message appears to be from the user.
    // The welcome message will not be displayed in the chat.
    if (provider && model && apiKey) {
      initChatModel();
      handleSendMessage("Hello?", false);
    }
  }, [apiSettingsSet]); // Run only when apiSettingsSet changes

  // Function to handle sending a message to the LLM
  const handleSendMessage = async (msg = input, addToMessages = true) => {
    if (msg.trim() && chatModelRef.current) {
      setIsLoading(true);
      setInput("");

      if (addToMessages) {
        const userMessage = new HumanMessage(msg);
        const aiWaitMessage = new AIMessage("* * *"); // Waiting message. TODO: Replace with animated gif
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          aiWaitMessage,
        ]);
      }

      // Base message variable for the ai response or error message:
      let responseMessage: BaseMessage;

      try {
        const response = await chatModelRef.current.sendMessage(msg);
        const parsedResponse = parseLLMResponse(response.content as string);
        console.log("Parsed response:", parsedResponse);
        if (!parsedResponse) {
          throw new Error("Invalid response from LLM");
        }
        responseMessage = new AIMessage(parsedResponse.messageForUser);
      } catch (error) {
        console.error("Error getting response from ChatModel:", error);
        responseMessage = new AIMessage(
          "Sorry, I encountered an error. Please try again."
        );
      } finally {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove the waiting message at the end
          responseMessage,
        ]);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
      <Card className="flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full bg-stone-200 rounded flex items-center justify-center">
          <img src="" alt={secretWord} className="max-h-full max-w-full" />
        </div>
      </Card>
      <Card className="flex flex-col p-4 overflow-hidden">
        <ScrollArea className="flex-grow mb-4">
          <div ref={scrollAreaRef} className="text-2xl">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 text-${
                  msg instanceof HumanMessage ? "right" : "left"
                }`}
              >
                <span
                  className={`inline-block rounded px-3 py-2 my-2 ${
                    msg instanceof HumanMessage ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {String(msg.content)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) =>
              e.key === "Enter" && !isLoading && handleSendMessage()
            }
            placeholder="Type your message..."
            className="flex-grow text-xl"
            disabled={isLoading}
          />
          <Button
            className="text-xl"
            onClick={() => input !== "" && handleSendMessage()}
            disabled={isLoading || !isChatEnabled}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameUI;
