import chippoLogo from "@/assets/chippo-logo.png";
import { Menu, User, Plus, MessageSquare, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SavedConversation {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatHeaderProps {
  savedConversations?: SavedConversation[];
  onLoadConversation?: (id: string) => void;
  onDeleteConversation?: (id: string, e: React.MouseEvent) => void;
  onNewChat?: () => void;
}

const ChatHeader = ({ 
  savedConversations = [], 
  onLoadConversation, 
  onDeleteConversation,
  onNewChat 
}: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border" dir="rtl">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-card border-border w-64 max-h-80 overflow-y-auto">
          {onNewChat && (
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onNewChat}>
              <Plus className="w-4 h-4" />
              שיחה חדשה
            </DropdownMenuItem>
          )}
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
                  onClick={() => onLoadConversation?.(conv.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  {onDeleteConversation && (
                    <button
                      onClick={(e) => onDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <img 
        src={chippoLogo} 
        alt="Chippo" 
        className="h-12 w-auto"
      />
      
      <div className="w-10"></div>
    </header>
  );
};

export default ChatHeader;