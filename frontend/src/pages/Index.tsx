import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import OrderList, { OrderItem } from "@/components/chat/OrderList";
import { toast } from "sonner";
import { Menu, Search, User, Plus, MessageSquare, Trash2 } from "lucide-react";
import chippoLogo from "@/assets/chippo-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  orderItems: OrderItem[];
  createdAt: number;
}

const CONVERSATIONS_KEY = "chippo_conversations";
type DemoStage = "intro" | "base" | "soup";


const menuItems = [
  { name: "צ'יפס קלאסי", brand: "Chippo", keywords: ["צ'יפס", "chips", "ציפס"] },
  { name: "צ'יפס בטטה", brand: "Chippo", keywords: ["בטטה", "sweet potato"] },
  { name: "המבורגר", brand: "Chippo", keywords: ["המבורגר", "burger", "בורגר"] },
  { name: "קולה", brand: "קוקה קולה", keywords: ["קולה", "cola", "שתייה"] },
  { name: "מים", brand: "נביעות", keywords: ["מים", "water"] },
  { name: "נאגטס", brand: "Chippo", keywords: ["נאגטס", "nuggets", "נגטס"] },
];

const baseVegetables: OrderItem[] = [
  { id: "v1", name: "עגבניות", brand: "שוק", quantity: 1 },
  { id: "v2", name: "מלפפונים", brand: "שוק", quantity: 1 },
  { id: "v3", name: "בצל", brand: "שוק", quantity: 2 },
  { id: "v4", name: "גזר", brand: "שוק", quantity: 1 },
];

const peaSoupItems: OrderItem[] = [
  { id: "s1", name: "אפונה קפואה", brand: "סנפרוסט", quantity: 1 },
  { id: "s2", name: "תפוחי אדמה", brand: "שוק", quantity: 2 },
  { id: "s3", name: "סלרי", brand: "שוק", quantity: 1 },
  { id: "s4", name: "מרק עוף", brand: "קנור", quantity: 1 },
];

const presetOptions = [
  { 
    id: "1", 
    label: "פעם ראשונה שלך?",
    isFirstTime: true,
    items: [],
    conversation: [
      { content: "פעם ראשונה שלך?", isBot: false },
      { content: "היי! אני Chippo - מודל AI שעוזר לך למצוא את המוצרים הכי טובים במחירים הכי משתלמים. אני משווה מחירים בין סופרים ומציע לך את הדיל הכי טוב!", isBot: true },
      { content: "איך זה עובד?", isBot: false },
      { content: "פשוט תגיד לי מה אתה צריך לקנות - זה יכול להיות רשימת מוצרים, מתכון שאתה רוצה להכין, או אפילו אירוע שאתה מתכנן. אני אבנה לך רשימת קניות מותאמת!", isBot: true },
      { content: "ואז מה?", isBot: false },
      { content: "אחרי שנבנה ביחד את הרשימה, אני אמצא לך את המחירים הכי טובים - אפשר לאסוף מסניף אחד או לפצל בין שני סופרים לחיסכון מקסימלי. מוכן להתחיל?", isBot: true },
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
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [demoStage, setDemoStage] = useState<DemoStage>("intro");

  // Load saved conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    if (saved) {
      setSavedConversations(JSON.parse(saved));
    }
  }, []);

  // Save current conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && hasStartedChat) {
      const firstUserMessage = messages.find(m => !m.isBot);
      const title = firstUserMessage?.content.slice(0, 30) || "שיחה חדשה";
      
      const conversation: SavedConversation = {
        id: currentConversationId || Date.now().toString(),
        title: title + (title.length >= 30 ? "..." : ""),
        messages,
        orderItems,
        createdAt: Date.now()
      };
      
      if (!currentConversationId) {
        setCurrentConversationId(conversation.id);
      }
      
      setSavedConversations(prev => {
        const filtered = prev.filter(c => c.id !== conversation.id);
        const updated = [conversation, ...filtered].slice(0, 20); // Keep max 20 conversations
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, orderItems, hasStartedChat]);

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

      if (demoStage === "intro") {
  setDemoStage("base");
  setOrderItems(baseVegetables);

  const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    isBot: true,
    content:
      "בניתי לך רשימה מותאמת של ירקות בסיסיים 🥕🥒🍅\n" +
      "יש משהו שתרצה לשנות או להוסיף?\n\n" +
      "אגב, ראיתי שמזג האוויר התקרר לאחרונה - אולי תרצה גם דברים למרק?"
  };

  setMessages(prev => [...prev, botMessage]);
  setIsTyping(false);
  return;
}

// שלב מרק
if (demoStage === "base" && content.includes("מרק")) {
  setDemoStage("soup");
  setOrderItems(prev => [...prev, ...peaSoupItems]);

  const botMessage: Message = {
    id: (Date.now() + 1).toString(),
    isBot: true,
    content:
      "מעולה! הוספתי לך את כל מה שצריך למרק אפונה 🍲\n" +
      "רוצה להוסיף עוד משהו?"
  };

  setMessages(prev => [...prev, botMessage]);
  setIsTyping(false);
  return;
}
      
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
    
    // Check if this is the "first time" introductory conversation
    if (preset.isFirstTime && preset.conversation) {
      // Start rolling conversation
      const initialMessages: Message[] = [];
      let delay = 0;
      
      preset.conversation.forEach((msg, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `${Date.now()}-${index}`,
            content: msg.content,
            isBot: msg.isBot
          }]);
        }, delay);
        delay += msg.isBot ? 1500 : 800;
      });
      return;
    }
    
    // Regular preset with items
    const presetOrderItems: OrderItem[] = preset.items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      name: item.name,
      brand: item.brand,
      quantity: 1
    }));
    setOrderItems(presetOrderItems);
    
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

  const loadConversation = (conversation: SavedConversation) => {
    setMessages(conversation.messages);
    setOrderItems(conversation.orderItems);
    setCurrentConversationId(conversation.id);
    setHasStartedChat(true);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
    toast.success("השיחה נמחקה");
  };

  const startNewChat = () => {
    setMessages([]);
    setOrderItems([]);
    setCurrentConversationId(null);
    setHasStartedChat(false);
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
            <DropdownMenuContent align="start" className="bg-card border-border w-64 max-h-80 overflow-y-auto">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                אזור אישי
              </DropdownMenuItem>
              {savedConversations.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                    שיחות אחרונות
                  </div>
                  {savedConversations.map((conv) => (
                    <DropdownMenuItem 
                      key={conv.id} 
                      className="gap-2 cursor-pointer group justify-between"
                      onClick={() => loadConversation(conv)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
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
          <div className="w-full max-w-2xl grid grid-cols-3 gap-3">
            {presetOptions.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className={`p-4 rounded-lg border border-border hover:border-primary/50 text-foreground transition-all hover:shadow-md text-center ${
                  preset.isFirstTime ? 'bg-primary/5' : ''
                }`}
              >
                <span className={`text-sm ${preset.isFirstTime ? 'font-bold' : 'font-medium'}`}>
                  {preset.label}
                </span>
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
      <ChatHeader 
        savedConversations={savedConversations}
        onLoadConversation={(id) => {
          const conv = savedConversations.find(c => c.id === id);
          if (conv) loadConversation(conv);
        }}
        onDeleteConversation={deleteConversation}
        onNewChat={startNewChat}
      />
      
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
