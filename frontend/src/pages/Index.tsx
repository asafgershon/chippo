import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

const botResponses = [
  "היי! אני Chippo 🦛 מה בא לך לאכול היום?",
  "צ'יפס זה תמיד רעיון טוב! יש לנו צ'יפס קלאסי וצ'יפס בטטה",
  "אהבתי! אולי גם משהו לשתות?",
  "מעולה! לחץ על הכפתור למעלה כדי לבחור את המוצרים שלך 👆",
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "היי! אני Chippo 🦛 מה בא לך לאכול היום?", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponses[responseIndex % botResponses.length],
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
      setResponseIndex(prev => prev + 1);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isBot={message.isBot}
            />
          ))}
          {isTyping && (
            <ChatMessage content="" isBot isTyping />
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Index;
