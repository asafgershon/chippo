import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import OrderList, { OrderItem } from "@/components/chat/OrderList";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

const menuItems = [
  { name: "צ'יפס קלאסי", brand: "Chippo", keywords: ["צ'יפס", "chips", "ציפס"] },
  { name: "צ'יפס בטטה", brand: "Chippo", keywords: ["בטטה", "sweet potato"] },
  { name: "המבורגר", brand: "Chippo", keywords: ["המבורגר", "burger", "בורגר"] },
  { name: "קולה", brand: "קוקה קולה", keywords: ["קולה", "cola", "שתייה"] },
  { name: "מים", brand: "נביעות", keywords: ["מים", "water"] },
  { name: "נאגטס", brand: "Chippo", keywords: ["נאגטס", "nuggets", "נגטס"] },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "היי! אני Chippo 🦛 מה בא לך לאכול היום?", isBot: true }
  ]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const findMenuItem = (text: string) => {
    const lowerText = text.toLowerCase();
    return menuItems.find(item => 
      item.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
    );
  };

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
      
      const foundItem = findMenuItem(content);
      let botResponse = "";
      
      if (foundItem) {
        const existingItem = orderItems.find(item => item.name === foundItem.name);
        if (existingItem) {
          setOrderItems(prev => prev.map(item => 
            item.name === foundItem.name ? { ...item, quantity: item.quantity + 1 } : item
          ));
          botResponse = `הוספתי עוד ${foundItem.name}! מה עוד?`;
        } else {
          setOrderItems(prev => [...prev, { 
            id: Date.now().toString(), 
            name: foundItem.name,
            brand: foundItem.brand,
            quantity: 1 
          }]);
          botResponse = `מעולה! הוספתי ${foundItem.name} לרשימה. עוד משהו?`;
        }
      } else {
        botResponse = "לא בטוח שהבנתי... אולי תנסה צ'יפס, המבורגר, נאגטס או משהו לשתות?";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleRemoveItem = (id: string) => {
    const item = orderItems.find(i => i.id === id);
    setOrderItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast.success(`${item.name} הוסר מההזמנה`);
    }
  };

  const handleEditItem = (id: string, newName: string, newBrand: string) => {
    setOrderItems(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName, brand: newBrand } : item
    ));
    toast.success(`שונה ל${newName}`);
  };

  const showOrderList = messages.length > 1;

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      
      <main className="flex-1 overflow-hidden flex">
        <div className="h-full flex-1 flex">
          {/* Order List - Right side (only after first message) */}
          {showOrderList && (
            <div className="w-72 flex-shrink-0 h-full">
              <OrderList 
                items={orderItems} 
                onRemove={handleRemoveItem}
                onReplace={handleEditItem}
                menuItems={menuItems}
              />
            </div>
          )}
          
          
          {/* Chat - Center */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-4">
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
            </div>
            <div className="p-4 border-t border-border">
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
