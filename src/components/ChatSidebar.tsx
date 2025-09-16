import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Sun, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
}

export function ChatSidebar({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  onToggleDarkMode,
  onClearChat 
}: ChatSidebarProps) {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-3-sonnet");
  const [systemPrompt, setSystemPrompt] = useState("You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest.");

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MessageSquare size={18} className="text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Assist AI</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Chat History & Settings */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {/* New Chat Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-10 glass border-white/10"
              onClick={() => window.location.reload()}
            >
              <MessageSquare size={16} />
              New Chat
            </Button>

            {/* Chat History */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground px-3 py-2">
                Recent Chats
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 glass border-transparent hover:border-white/10"
                >
                  <div className="truncate text-sm">
                    Current conversation...
                  </div>
                </Button>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Settings Section */}
            {/* Theme Toggle */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-sm">
                    Dark mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={onToggleDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Settings size={16} />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm">
                    Claude API Key (GCP)
                  </Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key for Claude on Google Cloud Platform
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-select" className="text-sm">
                    Model Selection
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      <SelectItem value="claude-instant">Claude Instant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt" className="text-sm">
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Enter system prompt..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[100px] text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Instructions that guide Claude's behavior
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Chat Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Chat Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onClearChat}
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear Conversation
                </Button>
              </CardContent>
            </Card>

            {/* Integration Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>🔄 Ready for Claude GCP integration</p>
                  <p>📡 Endpoint configuration needed</p>
                  <p>🔐 API authentication required</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 glass"
            >
              <Settings size={16} />
              Settings
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Assist AI v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}