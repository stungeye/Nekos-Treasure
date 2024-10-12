import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatModel from "@/classes/chatModel";
import { createLlm } from "@/classes/llmFactory";
import LocalStorageStore from "@/classes/localStorageStore";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import nekoImage from "../assets/neko.png"; // Import the image

interface GameUIProps {
  apiSettingsSet: boolean;
}

const GameUI: React.FC<GameUIProps> = ({ apiSettingsSet }) => {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false); // Track whether chat is enabled
  const chatModelRef = useRef<ChatModel | null>(null);
  const sessionIdRef = useRef<string>(`user-${Date.now()}`);
  const store = new LocalStorageStore("neko-api-settings");
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
    // a fun and very diverse collection of 50 possible secret words
    const possibleSecretWords = [
      "cat",
      "dog",
      "bird",
      "fish",
      "rabbit",
      "hamster",
      "turtle",
      "lizard",
      "snake",
      "frog",
      "spider",
      "ant",
      "bee",
      "wasp",
      "beetle",
      "butterfly",
      "dragonfly",
      "grasshopper",
      "ladybug",
      "firefly",
      "snail",
      "crab",
      "lobster",
      "apple",
      "banana",
      "orange",
      "grape",
      "strawberry",
      "blueberry",
      "raspberry",
      "kiwi",
      "pineapple",
      "watermelon",
      "peach",
      "pear",
      "cherry",
      "coconut",
      "pumpkin",
      "witch",
      "vampire",
      "werewolf",
      "zombie",
      "ghost",
      "skeleton",
      "mummy",
      "alien",
      "robot",
      "ninja",
      "pirate",
      "cowboy",
      "knight",
      "wizard",
      "mermaid",
      "fairy",
      "unicorn",
      "dragon",
    ];

    // randomly select a secret word from the list
    const secretWord =
      possibleSecretWords[
        Math.floor(Math.random() * possibleSecretWords.length)
      ];
    const initChatModel = async () => {
      const llm = createLlm(provider, 0.7, model, apiKey);
      const systemPrompt =
        "You are a mysterious cat named Neko in an interactive game. Provide engaging, contextual, and concise responses. The user is trying to guess your secret word, which is '" +
        secretWord +
        "' but don't give it to them directly unless they guess it correctly. When you first meet the user, you can let them know that you have a treasure that can be unlocked with a secret word. You can also give hints to the user if they are stuck. Be creative and have fun. Make sure your hints are tricky and fully accurate! You use emoji to increase engagement but you will never give away the secret word using an emoji.";
      chatModelRef.current = new ChatModel(llm, systemPrompt);
    };

    if (provider && model && apiKey) {
      initChatModel();
      handleSendMessage("Hello?", false);
    }
  }, [apiSettingsSet]); // Run only when apiSettingsSet changes

  const handleSendMessage = async (msg = input, addToMessages = true) => {
    if (msg.trim() && chatModelRef.current) {
      setIsLoading(true);

      if (addToMessages) {
        const userMessage = new HumanMessage(msg);
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
      }

      try {
        const response = await chatModelRef.current.sendMessage(
          msg,
          sessionIdRef.current
        );
        setMessages((prevMessages) => [...prevMessages, response]);
      } catch (error) {
        console.error("Error getting response from ChatModel:", error);
        const errorMessage = new AIMessage(
          "Sorry, I encountered an error. Please try again."
        );
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
      <Card className="flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full bg-stone-200 rounded flex items-center justify-center">
          <img src={nekoImage} alt="Neko" className="max-h-full max-w-full" />
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
