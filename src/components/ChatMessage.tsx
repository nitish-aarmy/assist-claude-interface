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
    <div className={cn(
      "flex gap-4 max-w-4xl mx-auto message-enter",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar - Enhanced Glass */}
      <div
        className={cn(
          "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center glass neomorphic glow-on-hover",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300"
        )}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message Content - Premium Glass */}
      <div className={cn("flex-1 min-w-0", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "glass neomorphic rounded-2xl px-6 py-4 max-w-2xl relative backdrop-blur-xl",
            isUser
              ? "ml-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/20"
              : "mr-auto bg-white/5 border-white/10",
            "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          )}
        >
          {/* Message bubble pointer */}
          <div className={cn(
            "absolute top-4 w-0 h-0",
            isUser 
              ? "right-[-8px] border-l-[8px] border-l-blue-200/20 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
              : "left-[-8px] border-r-[8px] border-r-white/20 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
          )} />
          
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thinking...
              </span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className={cn(
                "whitespace-pre-wrap leading-relaxed m-0 font-medium",
                isUser 
                  ? "text-blue-900 dark:text-blue-100" 
                  : "text-gray-800 dark:text-gray-200"
              )}>
                {message.content}
              </p>
            </div>
          )}
        </div>
        
        <div className={cn(
          "text-xs text-muted-foreground mt-2 px-2 font-medium",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}