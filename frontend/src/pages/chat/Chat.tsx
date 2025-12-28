import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MoreVertical, Phone, Video, Paperclip, Mic, Send, 
  Check, CheckCheck, Lock, Smile, Video as VideoIcon
} from "lucide-react";

/* -------------------------------------------------------
   1. Mock Data (Unchanged)
------------------------------------------------------- */
interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  status: "sent" | "delivered" | "read";
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isVerified?: boolean;
  typing?: boolean;
}

const MOCK_CONTACTS: ChatContact[] = [
  { id: "1", name: "Aaradhya Sen", avatar: "A", lastMessage: "The design files are ready 🎨", time: "10:42 AM", unread: 2, online: true, isVerified: true, typing: true },
  { id: "2", name: "Rohan Das", avatar: "R", lastMessage: "Can we reschedule the call?", time: "Yesterday", unread: 0, online: false },
  { id: "3", name: "Vikram Singh", avatar: "V", lastMessage: "Sent you the contract PDF.", time: "Mon", unread: 0, online: true },
  { id: "4", name: "Priya K", avatar: "P", lastMessage: "Let's meet at the cafe!", time: "Sun", unread: 5, online: false },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", text: "Hey! How is the project going?", sender: "them", time: "10:30 AM", status: "read" },
    { id: "m2", text: "Going great! Just finishing the UI.", sender: "me", time: "10:32 AM", status: "read" },
    { id: "m3", text: "Awesome. I need the assets by EOD.", sender: "them", time: "10:35 AM", status: "read" },
    { id: "m4", text: "The design files are ready 🎨", sender: "them", time: "10:42 AM", status: "read" },
  ],
};

/* -------------------------------------------------------
   2. Main Component
------------------------------------------------------- */
export const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX - 80; 
      if (newWidth > 280 && newWidth < 600) setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const handleChatSelect = (contact: ChatContact) => {
    setSelectedChatId(contact.id);
    setActiveChat(contact);
  };

  return (
    // 🟢 FIXED: Explicit colors (bg-white / dark:bg-black) to prevent the "Blackout"
    <div className="fixed top-16 left-0 md:left-20 right-0 bottom-0 flex z-10 shadow-2xl font-sans transition-colors duration-300
      bg-gray-50 dark:bg-[#0c0c0c] 
      text-gray-900 dark:text-white"
    >
      
      {/* 🟢 LEFT SIDEBAR */}
      <div 
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        className="h-full flex flex-col border-r shrink-0 relative
          bg-white dark:bg-[#0c0c0c]
          border-gray-200 dark:border-[#222]"
      >
        <ChatSidebar 
          contacts={MOCK_CONTACTS} 
          selectedId={selectedChatId} 
          onSelect={handleChatSelect} 
        />
      </div>

      {/* 🟢 RESIZER HANDLE */}
      <div
        onMouseDown={startResizing}
        className={`w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition-colors z-50 flex items-center justify-center shrink-0 ${isResizing ? 'bg-purple-500' : 'bg-transparent'}`}
      >
        <div className="h-12 w-[2px] rounded-full transition-colors group-hover:bg-purple-500
          bg-gray-300 dark:bg-[#333]" 
        />
      </div>

      {/* 🟢 RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative
        bg-gray-50 dark:bg-[#0c0c0c]"
      >
        {activeChat ? (
          <ActiveChatWindow contact={activeChat} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   3. Sidebar Content
------------------------------------------------------- */
const ChatSidebar = ({ contacts, selectedId, onSelect }: { contacts: ChatContact[], selectedId: string | null, onSelect: (c: ChatContact) => void }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-2 sticky top-0 z-10 border-b backdrop-blur-md
        bg-white/80 dark:bg-[#0c0c0c]/80
        border-gray-100 dark:border-[#222]"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Messages</h2>
          <button className="p-2 rounded-full transition-colors
            text-gray-500 hover:text-gray-900 hover:bg-gray-100
            dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#222]"
          >
             <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors
            text-gray-400 group-focus-within:text-purple-500" 
          />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..." 
            className="w-full rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none transition-all duration-300
              bg-gray-100 border-transparent text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500
              dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-gray-600 dark:focus:bg-[#111] dark:focus:border-purple-500" 
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelect(contact)}
            className={`
              relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group
              ${selectedId === contact.id 
                ? "bg-gray-100 dark:bg-[#1d1d1d] shadow-sm" 
                : "hover:bg-gray-50 dark:hover:bg-[#111]"
              }
            `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner
                ${selectedId === contact.id 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-200 text-gray-600 dark:bg-[#333] dark:text-gray-300"
                }
              `}>
                {contact.avatar}
              </div>
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-[3px] border-white dark:border-[#0c0c0c]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                   <span className={`font-semibold text-[15px] truncate 
                     ${selectedId === contact.id ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"}`}>
                     {contact.name}
                   </span>
                   {contact.isVerified && <CheckCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                </div>
                <span className={`text-[11px] font-medium shrink-0 
                  ${contact.unread > 0 ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`}>
                  {contact.time}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate leading-relaxed 
                  ${contact.unread > 0 ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                  {contact.typing ? <span className="text-purple-500 animate-pulse">typing...</span> : contact.lastMessage}
                </p>
                {contact.unread > 0 && (
                  <div className="min-w-[20px] h-[20px] bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1.5 ml-3 shrink-0">
                    {contact.unread}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   4. Active Chat Window
------------------------------------------------------- */
const ActiveChatWindow = ({ contact }: { contact: ChatContact }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const messages = MOCK_MESSAGES[contact.id] || []; 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contact, messages]);

  return (
    <>
      {/* Header */}
      <div className="h-20 px-8 flex items-center justify-between z-30 shrink-0 border-b backdrop-blur-xl
        bg-white/90 dark:bg-[#0c0c0c]/90
        border-gray-200 dark:border-[#222]"
      >
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-300
            bg-gray-100 text-gray-700 dark:bg-[#1d1d1d] dark:text-white">
            {contact.avatar}
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2
              text-gray-900 dark:text-white">
              {contact.name}
              {contact.isVerified && <CheckCheck className="w-4 h-4 text-purple-500" />}
            </h3>
            <p className="text-xs font-medium tracking-wide
              text-green-600 dark:text-green-500">
              {contact.online ? "Active Now" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-400 dark:text-gray-500">
           <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222]"><VideoIcon className="w-5 h-5" /></button>
           <button className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222]"><Phone className="w-5 h-5" /></button>
           <div className="w-[1px] h-6 bg-gray-200 dark:bg-[#222]" />
           <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
           <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 relative custom-scrollbar
          bg-gray-50 dark:bg-[#0c0c0c]"
      >
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Lock Notice */}
        <div className="flex justify-center mb-8 relative z-10">
          <span className="text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm tracking-wide uppercase border
            bg-white border-gray-200 text-gray-500
            dark:bg-[#1d1d1d] dark:border-[#222] dark:text-gray-400">
            <Lock className="w-3 h-3" /> End-to-end encrypted
          </span>
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              key={msg.id} 
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} relative z-10 group`}
            >
              <div 
                className={`
                  max-w-[65%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm
                  ${msg.sender === "me" 
                    ? "bg-purple-600 text-white rounded-[20px] rounded-tr-sm" 
                    : "bg-white text-gray-900 border border-gray-100 dark:bg-[#1d1d1d] dark:text-gray-100 dark:border-[#2a2a2a] rounded-[20px] rounded-tl-sm"
                  }
                `}
              >
                <span className="break-words font-light tracking-wide">{msg.text}</span>
                <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 opacity-70`}>
                  {msg.time}
                  {msg.sender === 'me' && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 shrink-0 border-t
        bg-white dark:bg-[#0c0c0c]
        border-gray-100 dark:border-[#222]"
      >
        <div className="flex items-end gap-3 p-2 rounded-[24px] border transition-all duration-300
          bg-gray-100 border-transparent focus-within:bg-white focus-within:border-purple-500 focus-within:shadow-lg
          dark:bg-[#1d1d1d] dark:border-[#333] dark:focus-within:bg-[#151515] dark:focus-within:border-purple-500"
        >
           
           <div className="flex pb-1">
             <button className="p-2.5 rounded-full transition-colors
               text-gray-500 hover:text-gray-900 hover:bg-gray-200
               dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#333]">
               <Smile className="w-6 h-6 stroke-[1.5]" />
             </button>
             <button className="p-2.5 rounded-full transition-colors
               text-gray-500 hover:text-gray-900 hover:bg-gray-200
               dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#333]">
               <Paperclip className="w-6 h-6 stroke-[1.5]" />
             </button>
           </div>

           <div className="flex-1 py-2.5">
             <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Type a message..." 
               className="w-full bg-transparent focus:outline-none text-[15px]
                 text-gray-900 placeholder:text-gray-400
                 dark:text-white dark:placeholder:text-gray-600"
               onKeyDown={(e) => e.key === 'Enter' && setInput("")}
             />
           </div>

           {input.trim() ? (
             <motion.button 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg"
             >
               <Send className="w-5 h-5 fill-current" />
             </motion.button>
           ) : (
             <button className="p-3 rounded-full transition-colors
               text-gray-500 hover:text-gray-900 hover:bg-gray-200
               dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#333]">
               <Mic className="w-6 h-6 stroke-[1.5]" />
             </button>
           )}
        </div>
        <div className="text-center mt-2 text-[10px] text-gray-400 dark:text-gray-600">
           Press Enter to send
        </div>
      </div>
    </>
  );
};

/* -------------------------------------------------------
   5. Empty State
------------------------------------------------------- */
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full relative overflow-hidden
    bg-gray-50 dark:bg-[#0c0c0c]"
  >
     {/* Abstract Decor */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[100px]
       bg-purple-500" 
     />
     
     <div className="relative z-10 mb-8 p-8 rounded-full border shadow-xl
       bg-white border-gray-100
       dark:bg-[#1d1d1d] dark:border-[#222]"
     >
       <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm
         bg-purple-100 text-purple-600
         dark:bg-purple-900/30 dark:text-purple-400"
       >
          <Lock className="w-8 h-8" />
       </div>
     </div>
     
     <h2 className="text-4xl font-light mb-4 tracking-tight
       text-gray-900 dark:text-white">
       Prava 2.0
     </h2>
     <p className="max-w-md text-sm leading-7 font-light
       text-gray-500 dark:text-gray-400">
       Experience secure, high-fidelity communication. <br/>
       Select a contact to begin your encrypted session.
     </p>
     
     <div className="mt-16 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase
       text-gray-400 dark:text-gray-600">
       <Lock className="w-3 h-3" /> End-to-end encrypted
     </div>
  </div>
);