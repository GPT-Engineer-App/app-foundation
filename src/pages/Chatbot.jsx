import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupabaseAuth } from "../integrations/supabase/auth.jsx";
import { useChatMessages, useAddChatMessage } from "../integrations/supabase/index.js";

const Chatbot = () => {
  const { session } = useSupabaseAuth();
  const [input, setInput] = useState("");
  const threadId = "thread_MK8FMEVy4KCVROHOycAqFMwO"; // Replace with your actual thread ID
  const { data: messages, isLoading, error } = useChatMessages(threadId);
  const addChatMessage = useAddChatMessage();

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { thread_id: threadId, user_id: session.user.id, message: input };
      setInput("");
      try {
        await addChatMessage.mutateAsync(userMessage);
        const response = await fetch("https://okligg.buildship.run/chat_tutor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input, threadId }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage = { thread_id: threadId, user_id: null, message: data.message };
          await addChatMessage.mutateAsync(botMessage);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading messages</div>;
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start my-2 ${message.user_id === session.user.id ? "justify-end" : "justify-start"}`}
          >
            {message.user_id === null && (
              <Avatar className="mr-2">
                <AvatarImage src="/images/bot-avatar.png" alt="Bot Avatar" />
                <AvatarFallback>Bot</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-2 rounded-lg ${message.user_id === session.user.id ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
            >
              {message.user_id === null ? (
                <ReactMarkdown>{message.message}</ReactMarkdown>
              ) : (
                message.message
              )}
            </div>
            {message.user_id === session.user.id && (
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