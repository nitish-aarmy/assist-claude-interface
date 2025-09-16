import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end gap-4">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "resize-none min-h-[60px] max-h-[120px] pr-16 pl-6 py-4",
              "glass border-white/20 backdrop-blur-xl rounded-2xl",
              "text-base font-medium placeholder:text-muted-foreground/70",
              "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/30",
              "transition-all duration-300 hover:shadow-lg",
              "bg-white/5 dark:bg-black/5"
            )}
            rows={1}
          />
          
          {/* Voice input button */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="absolute right-16 bottom-3 h-10 w-10 p-0 glass-button rounded-xl"
            disabled={disabled}
            title="Voice input (coming soon)"
          >
            <Mic size={18} className="text-muted-foreground hover:text-primary" />
          </Button>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          size="lg"
          className={cn(
            "h-[60px] px-6 rounded-2xl glass-button font-semibold",
            "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
            "text-white shadow-lg hover:shadow-xl",
            "transition-all duration-300 transform hover:scale-105 glow-on-hover",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Send size={20} />
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground/70 mt-3 text-center font-medium">
        <span className="px-3 py-1 glass rounded-full backdrop-blur-sm">
          Press <kbd className="px-1 bg-white/10 rounded text-xs">Enter</kbd> to send • 
          <kbd className="px-1 bg-white/10 rounded text-xs ml-1">Shift+Enter</kbd> for new line
        </span>
      </div>
    </div>
  );
}