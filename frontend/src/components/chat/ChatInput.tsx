import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-card border-t border-border">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="כתוב הודעה..."
        disabled={disabled}
        className="flex-1 bg-secondary border border-input rounded-xl px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
      <Button
        type="submit"
        variant="chippo"
        size="icon"
        disabled={!message.trim() || disabled}
        className="h-12 w-12 rounded-xl"
      >
        <Send className="h-5 w-5 rotate-180" />
      </Button>
    </form>
  );
};

export default ChatInput;
