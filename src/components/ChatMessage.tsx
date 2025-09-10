import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 py-4 px-4 max-w-4xl mx-auto animate-slide-up")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "rounded-lg px-4 py-3 max-w-none",
            isUser
              ? "bg-message-user text-message-user-foreground ml-auto"
              : "bg-message-ai text-message-ai-foreground",
            "shadow-sm"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              <span>Thinking</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-typing"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-typing" style={{ animationDelay: "0.3s" }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-typing" style={{ animationDelay: "0.6s" }}></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed m-0">
                {message.content}
              </p>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}