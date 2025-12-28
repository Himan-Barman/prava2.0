import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, UserPlus, MessageCircle, Star, Settings, 
  CheckCheck, AtSign, Zap, MoreHorizontal 
} from "lucide-react";

/* -------------------------------------------------------
   1. Mock Data & Types
------------------------------------------------------- */
type NotificationType = "like" | "follow" | "comment" | "system" | "mention";

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content?: string; // For comments/mentions
  postImage?: string; // For likes/comments context
  time: string;
  isRead: boolean;
}

const NOTIFS: Notification[] = [
  { 
    id: "1", type: "like", 
    user: { name: "Aaradhya Sen", avatar: "A", isVerified: true }, 
    postImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop",
    time: "2m", isRead: false 
  },
  { 
    id: "2", type: "follow", 
    user: { name: "Rohan Das", avatar: "R" }, 
    time: "1h", isRead: false 
  },
  { 
    id: "3", type: "comment", 
    user: { name: "Vikram Singh", avatar: "V" }, 
    content: "This design is absolutely stunning! 🔥",
    postImage: "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=150&auto=format&fit=crop",
    time: "3h", isRead: true 
  },
  { 
    id: "4", type: "system", 
    user: { name: "Prava Team", avatar: "P", isVerified: true }, 
    content: "Welcome to Prava Premium. Your exclusive features are now active.",
    time: "1d", isRead: true 
  },
  { 
    id: "5", type: "mention", 
    user: { name: "Sarah Lens", avatar: "S" }, 
    content: "Hey @alex, check this out!",
    time: "2d", isRead: true 
  },
];

const TABS = ["All", "Verified", "Mentions"];

/* -------------------------------------------------------
   2. Main Component
------------------------------------------------------- */
export const Notifications = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e5e5e5] font-sans flex justify-center">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />

      <div className="w-full max-w-[600px] border-x border-[#1f1f1f] min-h-screen relative z-10">
        
        {/* 🟢 HEADER (Sticky Glass) */}
        <div className="sticky top-0 z-30 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-[#1f1f1f]">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-xl font-bold tracking-tight">Activity</h1>
            <button className="p-2 hover:bg-[#1d1d1d] rounded-full transition-colors text-[#6a6372] hover:text-[#e5e5e5]">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex px-4 pb-0 gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative pb-4 text-sm font-medium transition-colors"
              >
                <span className={activeTab === tab ? "text-[#e5e5e5]" : "text-[#6a6372] hover:text-[#e5e5e5]"}>
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#b984f8] rounded-t-full" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🟢 NOTIFICATION LIST */}
        <div className="pb-20">
          <AnimatePresence mode="popLayout">
            {NOTIFS.map((item, i) => (
              <NotificationItem key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
          
          {/* End of List */}
          <div className="py-12 flex flex-col items-center justify-center text-[#6a6372] opacity-50">
             <CheckCheck className="w-8 h-8 mb-2" />
             <p className="text-xs font-medium uppercase tracking-widest">You're all caught up</p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* -------------------------------------------------------
   3. Notification Item Component
------------------------------------------------------- */
const NotificationItem = ({ item, index }: { item: Notification, index: number }) => {
  
  // Icon Logic based on Type
  const getIcon = () => {
    switch (item.type) {
      case "like": return <Heart className="w-3.5 h-3.5 fill-white text-white" />;
      case "follow": return <UserPlus className="w-3.5 h-3.5 text-white" />;
      case "comment": return <MessageCircle className="w-3.5 h-3.5 text-white" />; // Corrected to MessageCircle
      case "mention": return <AtSign className="w-3.5 h-3.5 text-white" />;
      case "system": return <Zap className="w-3.5 h-3.5 fill-white text-white" />;
      default: return <Star className="w-3.5 h-3.5 text-white" />;
    }
  };

  // Color Logic (Badge Background)
  const getBadgeColor = () => {
    switch (item.type) {
      case "like": return "bg-gradient-to-tr from-pink-500 to-rose-500";
      case "follow": return "bg-gradient-to-tr from-blue-500 to-indigo-500";
      case "comment": return "bg-gradient-to-tr from-emerald-500 to-teal-500";
      case "system": return "bg-gradient-to-tr from-amber-500 to-orange-500";
      default: return "bg-[#b984f8]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative px-5 py-4 border-b border-[#1f1f1f] flex gap-4 transition-colors cursor-pointer group
        ${!item.isRead ? "bg-[#b984f8]/5 hover:bg-[#b984f8]/10" : "bg-transparent hover:bg-[#111]"}
      `}
    >
      {/* Left: Avatar with Badge */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#333] flex items-center justify-center font-bold text-[#e5e5e5]">
          {item.user.avatar}
        </div>
        
        {/* The Action Badge */}
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0c0c0c] flex items-center justify-center shadow-lg ${getBadgeColor()}`}>
          {getIcon()}
        </div>
      </div>

      {/* Middle: Content */}
      <div className="flex-1 text-[15px] leading-relaxed">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#e5e5e5]">{item.user.name}</span>
            {item.user.isVerified && <CheckCheck className="w-3.5 h-3.5 text-[#b984f8]" />}
          </div>
          <span className="text-xs text-[#6a6372]">{item.time}</span>
        </div>

        {/* Dynamic Text based on Type */}
        <div className="text-[#e5e5e5]/80 mt-0.5">
          {item.type === "like" && <span>liked your post</span>}
          {item.type === "follow" && <span>started following you</span>}
          {item.type === "system" && <span className="text-[#b984f8]">{item.content}</span>}
          {(item.type === "comment" || item.type === "mention") && (
            <span className="text-[#6a6372]">
              replied: <span className="text-[#e5e5e5]">{item.content}</span>
            </span>
          )}
        </div>

        {/* Follow Button (Only for Follow type) */}
        {item.type === "follow" && (
          <button className="mt-3 px-4 py-1.5 border border-[#2a2a2a] rounded-full text-xs font-bold hover:bg-[#e5e5e5] hover:text-black hover:border-transparent transition-all">
            Follow Back
          </button>
        )}
      </div>

      {/* Right: Post Preview or Unread Dot */}
      <div className="shrink-0 pt-1">
        {item.postImage ? (
          <img 
            src={item.postImage} 
            alt="Context" 
            className="w-10 h-10 rounded-lg object-cover border border-[#2a2a2a] opacity-80 group-hover:opacity-100 transition-opacity" 
          />
        ) : !item.isRead ? (
          <div className="w-2 h-2 rounded-full bg-[#b984f8]" />
        ) : (
          <MoreHorizontal className="w-4 h-4 text-[#6a6372] opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

    </motion.div>
  );
};