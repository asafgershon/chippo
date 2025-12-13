import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import OrderList, { OrderItem } from "@/components/chat/OrderList";
import { toast } from "sonner";
import { Menu, Search, User } from "lucide-react";
import chippoLogo from "@/assets/chippo-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const presetOptions = [
  { 
    id: "1", 
    label: "מוצרי בסיס למשפחה",
    items: [
      { name: "חלב", brand: "תנובה" },
      { name: "לחם", brand: "אנג'ל" },
      { name: "ביצים", brand: "משק לין" },
      { name: "גבינה צהובה", brand: "עמק" },
      { name: "חמאה", brand: "תנובה" },
    ]
  },
  { 
    id: "2", 
    label: "מתכון לעוגה",
    items: [
      { name: "קמח", brand: "מילואות" },
      { name: "סוכר", brand: "סוגת" },
      { name: "ביצים", brand: "משק לין" },
      { name: "חמאה", brand: "תנובה" },
      { name: "שוקולד מריר", brand: "עלית" },
    ]
  },
  { 
    id: "3", 
    label: "קניות לזוג",
    items: [
      { name: "יין אדום", brand: "יקב רמת הגולן" },
      { name: "גבינות", brand: "גד" },
      { name: "פסטה", brand: "ברילה" },
      { name: "רוטב עגבניות", brand: "סוגת" },
    ]
  },
  { 
    id: "4", 
    label: "ארוחת בוקר לחברים",
    items: [
      { name: "ביצים", brand: "משק לין" },
      { name: "לחם", brand: "אנג'ל" },
      { name: "גבינה לבנה", brand: "תנובה" },
      { name: "ירקות טריים", brand: "שוק" },
      { name: "תפוזים לסחיטה", brand: "ישראלי" },
    ]
  },
  { 
    id: "5", 
    label: "מוצרי תינוקות",
    items: [
      { name: "חיתולים", brand: "האגיס" },
      { name: "מגבונים", brand: "האגיס" },
      { name: "תמ\"ל", brand: "מטרנה" },
      { name: "מחית פירות", brand: "מטרנה" },
    ]
  },
  { 
    id: "6", 
    label: "ערב המבורגרים",
    items: [
      { name: "בשר טחון", brand: "אנגוס" },
      { name: "לחמניות המבורגר", brand: "אנג'ל" },
      { name: "גבינה צהובה", brand: "עמק" },
      { name: "חסה", brand: "שוק" },
      { name: "עגבניות", brand: "שוק" },
      { name: "צ'יפס", brand: "Chippo" },
    ]
  },
  { 
    id: "7", 
    label: "רווק תל אביבי",
    items: [
      { name: "חומוס", brand: "צבר" },
      { name: "פיתות", brand: "אנג'ל" },
      { name: "בירה", brand: "גולדסטאר" },
      { name: "סושי מוכן", brand: "סושי בר" },
    ]
  },
  { 
    id: "8", 
    label: "רווק לא תל אביבי",
    items: [
      { name: "נקניקיות", brand: "זוגלובק" },
      { name: "לחם", brand: "אנג'ל" },
      { name: "קטשופ", brand: "הינץ" },
      { name: "במבה", brand: "אסם" },
      { name: "קולה", brand: "קוקה קולה" },
    ]
  },
  { 
    id: "9", 
    label: "קניות שבועיות",
    items: [
      { name: "חלב", brand: "תנובה" },
      { name: "לחם", brand: "אנג'ל" },
      { name: "ביצים", brand: "משק לין" },
      { name: "פירות", brand: "שוק" },
      { name: "ירקות", brand: "שוק" },
      { name: "עוף", brand: "עוף טוב" },
    ]
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

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

  const handlePresetClick = (preset: typeof presetOptions[0]) => {
    setHasStartedChat(true);
    
    // Add preset items to order list
    const presetOrderItems: OrderItem[] = preset.items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      name: item.name,
      brand: item.brand,
      quantity: 1
    }));
    setOrderItems(presetOrderItems);
    
    // Add user message and bot response
    const userMessage: Message = {
      id: Date.now().toString(),
      content: preset.label,
      isBot: false
    };
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `מעולה! הוספתי לך רשימה של ${preset.label}. אפשר לערוך או להוסיף עוד מוצרים!`,
      isBot: true
    };
    
    setMessages([userMessage, botMessage]);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const showOrderList = hasStartedChat && messages.length > 1;

  // Landing page view
  if (!hasStartedChat) {
    return (
      <div className="flex flex-col min-h-screen bg-background" dir="rtl">
        {/* Header with hamburger menu */}
        <header className="flex justify-between items-center p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Menu className="w-6 h-6 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                אזור אישי
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div></div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          {/* Logo */}
          <div className="mb-6">
            <img src={chippoLogo} alt="Chippo" className="h-24 w-auto" />
          </div>

          {/* Question */}
          <h1 className="text-2xl font-bold text-foreground mb-8 text-center">
            מה תרצה לקנות היום?
          </h1>

          {/* Search input */}
          <form onSubmit={handleInputSubmit} className="w-full max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="חפש מוצרים..."
                className="w-full px-4 py-3 pr-12 border border-border rounded-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                dir="rtl"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Preset options grid - 3x3 */}
          <div className="w-full max-w-3xl grid grid-cols-3 gap-3">
            {presetOptions.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="p-4 rounded-lg border border-border hover:border-primary/50 text-foreground transition-all hover:shadow-md text-center"
              >
                <span className="font-medium text-sm">{preset.label}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Chat view (after starting)
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
