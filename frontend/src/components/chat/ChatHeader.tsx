import chippoLogo from "@/assets/chippo-logo.png";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-center p-4 bg-card border-b border-border">
      <img 
        src={chippoLogo} 
        alt="Chippo" 
        className="h-12 w-auto"
      />
    </header>
  );
};

export default ChatHeader;
