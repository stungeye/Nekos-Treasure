import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatModel from "@/classes/chatModel";
import { createLlm } from "@/classes/llmFactory";
import LocalStorageStore from "@/classes/localStorageStore";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { levelManager } from "@/classes/levelConfig";
import { parseLLMResponse } from "@/classes/llmResponseParser";

interface GameUIProps {
  apiSettingsSet: boolean;
}

const GameUI: React.FC<GameUIProps> = ({ apiSettingsSet }) => {
  // Component state:
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  /*const [secretWord, setSecretWord] = useState<string>(
    levelManager.getSecretWord()
  );*/
  const [attemptsRemaining, setAttemptsRemaining] = useState(
    levelManager.getCurrentLevelConfig().attempts
  );
  const [gameOver, setGameOver] = useState(false);
  const [waitingForNextLevel, setWaitingForNextLevel] = useState(false);

  // References and local storage:
  const store = new LocalStorageStore("neko-api-settings");
  const chatModelRef = useRef<ChatModel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView(false);
    }
  }, [messages]);

  // Focus input after AI response finishes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Helper: Clear conversation and reprompt with "Hello?"
  const reinitializeConversation = async () => {
    setMessages([]);
    const provider = store.get("provider");
    const model = store.get("model");
    const apiKey = store.get("apiKey");
    if (provider && model && apiKey) {
      const llm = createLlm(provider, 0.7, model, apiKey);
      chatModelRef.current = new ChatModel(
        llm,
        levelManager.getSystemMessage()
      );
      // Pass "true" as third argument to ignore gameOver flag during reinitialization.
      await handleSendMessage("Hello?", false, true);
    }
  };

  // Initialize chat model when API settings are complete.
  useEffect(() => {
    setMessages([]);
    if (!apiSettingsSet) {
      setIsChatEnabled(false);
      return;
    }
    setIsChatEnabled(true);
    const provider = store.get("provider");
    const model = store.get("model");
    const apiKey = store.get("apiKey");
    const initChatModel = async () => {
      console.log("Initializing chat model...");
      const llm = createLlm(provider, 0.7, model, apiKey);
      // Reset level manager and update UI state:
      levelManager.resetGame();
      //setSecretWord(levelManager.getSecretWord());
      setAttemptsRemaining(levelManager.getCurrentLevelConfig().attempts);
      chatModelRef.current = new ChatModel(
        llm,
        levelManager.getSystemMessage()
      );
      console.log("Chat model initialized:", chatModelRef.current);
      await handleSendMessage("Hello?", false, true);
    };
    if (provider && model && apiKey) {
      initChatModel();
    }
  }, [apiSettingsSet]);

  // Restart game (after a loss)
  const restartGame = async () => {
    levelManager.resetGame();
    // setSecretWord(levelManager.getSecretWord());
    setAttemptsRemaining(levelManager.getCurrentLevelConfig().attempts);
    setGameOver(false);
    setWaitingForNextLevel(false);
    setIsChatEnabled(true);
    await reinitializeConversation();
  };

  // Proceed to next level (after a correct guess)
  const proceedToNextLevel = async () => {
    const advanced = levelManager.advanceLevel();
    if (advanced) {
      // setSecretWord(levelManager.getSecretWord());
      setAttemptsRemaining(levelManager.getCurrentLevelConfig().attempts);
      setWaitingForNextLevel(false);
      setIsChatEnabled(true);
      await reinitializeConversation();
    } else {
      // No more levels; game complete.
      setMessages([]);
      setIsChatEnabled(false);
      setGameOver(true);
      setWaitingForNextLevel(false);
      setMessages((prev) => [
        ...prev,
        new AIMessage("Congratulations! You've completed the game!"),
      ]);
    }
  };

  // Modified handleSendMessage that accepts an optional ignoreGameOver flag.
  const handleSendMessage = async (
    msg = input,
    addToMessages = true,
    ignoreGameOver = false
  ) => {
    if (!msg.trim()) {
      console.log("msg empty!");
      return;
    } // Ignore empty messages
    // Ignore if game is over but, allow if ignoreGameOver (for system reinitialization)
    if (gameOver && !ignoreGameOver) {
      console.log("game is over");
      return;
    }
    if (!chatModelRef.current) {
      console.error("Chat model is not initialized.");
      return;
    }

    setIsLoading(true);
    setInput("");
    if (addToMessages) {
      const userMessage = new HumanMessage(msg);
      const aiWaitMessage = new AIMessage("* * *");
      setMessages((prev) => [...prev, userMessage, aiWaitMessage]);
    }
    let responseMessage: BaseMessage;
    try {
      const finalGuess =
        attemptsRemaining === 1
          ? "<system>If attemptMade is true and correctGuess is false, tell the user they have lost the game.</system>"
          : "";
      const msgToSend = `${msg.trim()} ${finalGuess}`;
      console.log("Sending message to ChatModel:", msgToSend);
      const response = await chatModelRef.current.sendMessage(msgToSend);
      const parsedResponse = parseLLMResponse(response.content as string);
      console.log("Parsed response:", parsedResponse);
      if (!parsedResponse) {
        throw new Error("Invalid response from LLM");
      }

      // Process attempts and level advancement.
      if (parsedResponse.attemptMade) {
        if (parsedResponse.correctGuess) {
          // Correct guess: show congratulatory message and wait for user to trigger next level.
          responseMessage = new AIMessage(parsedResponse.messageForUser);
          setWaitingForNextLevel(true);
          setIsChatEnabled(false);
        } else {
          // Incorrect guess: decrement attempts.
          setAttemptsRemaining((prev) => {
            const newAttempts = prev - 1;
            if (newAttempts <= 0) {
              setIsChatEnabled(false);
              setGameOver(true);
              responseMessage = new AIMessage(parsedResponse.messageForUser);
            } else {
              responseMessage = new AIMessage(parsedResponse.messageForUser);
            }
            return newAttempts;
          });
        }
      } else {
        // Not an attempt; simply show the message.
        responseMessage = new AIMessage(parsedResponse.messageForUser);
      }
    } catch (error) {
      console.error("Error getting response from ChatModel:", error);
      responseMessage = new AIMessage(
        "Sorry, I encountered an error. Please try again."
      );
    } finally {
      // Remove the waiting placeholder and add the actual AI response.
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [...updated, responseMessage];
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
      <Card className="flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full bg-stone-200 rounded flex flex-col items-center justify-center">
          <img
            src={levelManager.getCurrentLevelConfig().imageUrl}
            className="max-h-full max-w-full mb-4"
          />
          <div className="mt-2 text-lg">
            Attempts Remaining: {attemptsRemaining}
          </div>
          <div className="mt-2 text-lg">
            Current Level: {levelManager.getCurrentLevelIndex() + 1}
          </div>
          {waitingForNextLevel && (
            <Button className="mt-4" onClick={proceedToNextLevel}>
              Next Level
            </Button>
          )}
          {gameOver && (
            <Button className="mt-4" onClick={restartGame}>
              Restart Game
            </Button>
          )}
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
            disabled={isLoading || !isChatEnabled}
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
