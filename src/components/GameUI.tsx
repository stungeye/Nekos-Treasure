import { useState } from "react";

import APISettings from "@/components/APISettings";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  text: string;
  sender: "user" | "system";
}

const GameUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Here you would typically send the input to your game logic
      // and receive a response to add to the messages
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Neko's Treasure</h1>
        <APISettings />
      </nav>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <Card className="flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            Graphics Area
          </div>
        </Card>

        <Card className="flex flex-col p-4 overflow-hidden">
          <ScrollArea className="flex-grow mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 text-${
                  msg.sender === "user" ? "right" : "left"
                }`}
              >
                <span className="inline-block bg-blue-100 rounded px-2 py-1">
                  {msg.text}
                </span>
              </div>
            ))}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameUI;
