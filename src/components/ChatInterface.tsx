import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MessageSquare } from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  console.log("ChatInterface component rendering");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "I am Assist AI, your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Real API call to backend /vertex endpoint
      const response = await fetch("http://localhost:8080/vertex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "AQ.Ab8RN6IZueSJaL22_NIdKSwdbm7EszZSENj9XblCKZlZ3_KzQw"
        },
        body: JSON.stringify({ message: content })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.reply,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || "Claude call failed");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please check your API configuration and try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        content: "I am Assist AI, your AI assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onClearChat={handleClearChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageSquare size={18} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Assist AI</h1>
                <p className="text-xs text-muted-foreground">
                  Powered by AssistArmy
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="gap-2"
            >
              <Menu size={16} />
              Settings
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
          {messages.length === 1 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Welcome to Assist AI</h2>
                <p className="text-muted-foreground mb-6">
                  Start a conversation with Claude, your intelligent AI assistant. 
                  Configure your API settings in the sidebar to begin.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <ChatMessage
              message={{
                id: "loading",
                content: "",
                role: "assistant",
                timestamp: new Date(),
              }}
              isLoading={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask Claude anything..."
        />
      </div>
    </div>
  );
}