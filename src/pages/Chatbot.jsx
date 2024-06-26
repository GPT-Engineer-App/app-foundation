import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "../integrations/supabase/index.js";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";

const Chatbot = () => {
  const { session } = useSupabaseAuth();
  const { data: profile } = useProfile(session?.user?.id);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start p-2 my-2 rounded-lg ${
              message.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
            } message-container`}
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {message.sender === "user" ? (
              <>
                <Avatar className="mr-2">
                  <AvatarImage src={profile?.avatar_url} alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>{message.text}</div>
              </>
            ) : (
              <>
                <Avatar className="mr-2">
                  <AvatarImage src="/images/robot-avatar.png" alt="Bot Avatar" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 mr-2"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chatbot;