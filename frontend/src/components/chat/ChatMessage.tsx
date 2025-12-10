import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ content, isBot, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex animate-message-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-base leading-relaxed",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-tr-sm"
            : "bg-primary text-primary-foreground rounded-tl-sm"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1 items-center py-1">
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
