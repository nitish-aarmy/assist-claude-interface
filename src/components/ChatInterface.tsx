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

    // Simulate API call to Claude
    // TODO: Replace with actual Claude GCP API integration
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Mock Claude response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${content}"\n\nThis is a simulated response. To integrate with Claude on GCP, you'll need to:\n\n1. Set up your API key in the sidebar\n2. Configure the GCP endpoint\n3. Implement the actual API call in the handleSendMessage function\n\nI'm ready to help with any questions you have!`,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
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
    <div className="flex h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl float-animation" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl float-animation" style={{animationDelay: '3s'}} />

      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onClearChat={handleClearChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header - Glass Effect */}
        <header className="glass border-b border-white/20 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden glass-button"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Assist AI
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Powered by AssistArmy
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="glass-button gap-2 font-medium"
            >
              {isDarkMode ? '☀️' : '🌙'}
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="glass-button gap-2 font-medium"
            >
              <Menu size={16} />
              Settings
            </Button>
          </div>
        </header>

        {/* Messages Area - Enhanced Glass */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {messages.length === 1 && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-lg">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome to Assist AI
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Experience the future of AI
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6 p-6">
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
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Premium Glass */}
        <div className="p-6">
          <div className="glass neomorphic rounded-2xl p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Ask Claude anything... ✨"
            />
          </div>
        </div>
      </div>
    </div>
  );
}