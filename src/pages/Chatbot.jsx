import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Chatbot = () => {
  const { session } = useSupabaseAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage]);
      setInput("");
      try {
        const response = await fetch("https://okligg.buildship.run/chat_tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, threadId }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.message, sender: "bot" },
          ]);
          setThreadId(data.threadId);
        } else {
          console.error("Failed to fetch bot response");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  if (!session) {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log in to chat</DialogTitle>
          </DialogHeader>
          <Button onClick={() => window.location.href = "/login"}>Login</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start my-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "bot" && (
              <Avatar className="mr-2">
                <AvatarImage src="/images/bot-avatar.png" alt="Bot Avatar" />
                <AvatarFallback>Bot</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-2 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
            >
              {message.sender === "bot" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
            {message.sender === "user" && (
              <Avatar className="ml-2">
                <AvatarImage src={session.user.user_metadata.avatar_url} alt="User Avatar" />
                <AvatarFallback>{session.user.email[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 mr-2"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chatbot;