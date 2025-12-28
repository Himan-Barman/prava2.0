import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Link as LinkIcon, Calendar, Grid, Image as ImageIcon, 
  Users, MoreVertical, Edit3, Globe, Lock, CheckCheck, 
  Search, MessageCircle, Heart, Share2 
} from "lucide-react";

/* -------------------------------------------------------
   1. Configuration & Mock Data
------------------------------------------------------- */
type ViewState = "timeline" | "media" | "network_friends" | "network_followers" | "network_following";

const MOCK_USERS = Array(12).fill(null).map((_, i) => ({
  id: i,
  name: i % 2 === 0 ? "Rohan Das" : "Priya K",
  handle: i % 2 === 0 ? "@rohan_dev" : "@priya_art",
  role: i % 2 === 0 ? "Developer" : "Designer",
  avatar: `https://i.pravatar.cc/150?u=${i + 10}`
}));

const MOCK_MEDIA = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
  "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=800&q=80",
  "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
];

/* -------------------------------------------------------
   2. Main Component
------------------------------------------------------- */
export const Profile = () => {
  // State for the Right Panel View
  const [currentView, setCurrentView] = useState<ViewState>("timeline");
  
  // State for the 3-Dot Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click Outside Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // 🟢 MASTER CONTAINER: Responsive Fix applied (left-0 on mobile, left-20 on desktop)
    <div className="fixed top-16 left-0 md:left-20 right-0 bottom-0 bg-background flex overflow-hidden font-sans text-foreground">
      
      {/* =========================================================================
          LEFT AXIS (STATIC CONTROLLER)
          Hidden on mobile (md:flex), visible on desktop
      ========================================================================= */}
      <div className="hidden md:flex w-[380px] h-full border-r border-border bg-background flex-col shrink-0 z-20 shadow-[5px_0_30px_-10px_rgba(0,0,0,0.1)]">
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* 1. Avatar & Identity */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-6 group cursor-pointer">
               <div className="w-32 h-32 rounded-[2rem] p-1 bg-background border border-border shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                  <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-[1.8rem]"
                  />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border border-border shadow-sm">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse border-2 border-background" />
               </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Aaradhya Sen 
              <CheckCheck className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-muted-foreground text-sm font-medium mb-5">@aaradhya_dev</p>

            {/* Actions Row */}
            <div className="flex items-center gap-3 w-full">
              <button className="flex-1 h-10 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
              
              {/* 3-Dot Menu Wrapper */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`
                    h-10 w-10 rounded-xl border border-transparent flex items-center justify-center transition-all duration-300
                    ${isMenuOpen 
                      ? 'bg-secondary text-foreground rotate-90 border-border' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* 🌟 THE DARK POPUP */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 right-0 w-56 bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5"
                    >
                      <div className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">
                        Privacy Settings
                      </div>
                      
                      <button 
                        onClick={() => { setIsPrivate(false); setIsMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all
                          ${!isPrivate ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}
                        `}
                      >
                        <Globe className="w-4 h-4" /> Public Profile
                      </button>
                      
                      <button 
                          onClick={() => { setIsPrivate(true); setIsMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all mt-1
                            ${isPrivate ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}
                          `}
                      >
                        <Lock className="w-4 h-4" /> Private Account
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 2. Interactive Stats */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <StatBox label="Friends" value="1.2k" active={currentView === "network_friends"} onClick={() => setCurrentView("network_friends")} />
            <StatBox label="Followers" value="84k" active={currentView === "network_followers"} onClick={() => setCurrentView("network_followers")} />
            <StatBox label="Following" value="420" active={currentView === "network_following"} onClick={() => setCurrentView("network_following")} />
          </div>

          {/* 3. Bio & Details */}
          <div className="space-y-5 mb-8 p-4 bg-secondary/20 rounded-2xl border border-border/50">
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              Digital Architect 🏛️ <br/>
              Building the future of social connection. <br/>
              Based in Kolkata. 
            </p>
            <div className="space-y-2 pt-2 border-t border-border/50">
               <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                 <MapPin className="w-3.5 h-3.5" /> Kolkata, India
               </div>
               <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                 <LinkIcon className="w-3.5 h-3.5" /> <span className="text-primary hover:underline cursor-pointer">aaradhya.dev</span>
               </div>
               <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                 <Calendar className="w-3.5 h-3.5" /> Joined March 2024
               </div>
            </div>
          </div>

          {/* 4. Navigation Menu */}
          <div className="space-y-1">
            <NavButton icon={Grid} label="Timeline" active={currentView === "timeline"} onClick={() => setCurrentView("timeline")} />
            <NavButton icon={ImageIcon} label="Media Gallery" active={currentView === "media"} onClick={() => setCurrentView("media")} />
            <NavButton icon={Users} label="My Network" active={currentView.includes("network")} onClick={() => setCurrentView("network_friends")} />
          </div>

        </div>
      </div>

      {/* =========================================================================
          RIGHT AXIS (SCROLLABLE STAGE)
      ========================================================================= */}
      <div className="flex-1 h-full bg-secondary/30 dark:bg-[#000000] overflow-y-auto scroll-smooth relative">
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-full">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW: TIMELINE */}
            {currentView === "timeline" && (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                 <StickyHeader title="Timeline" subtitle="Latest updates and thoughts" />
                 <CreatePostInput />
                 <div className="space-y-4">
                   <PostCard text="The new profile layout is live! 🚀 It divides the experience into a Controller (Left) and a Stage (Right). Much cleaner." likes="1.2k" comments="45" />
                   <PostCard image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80" likes="3.4k" comments="120" />
                   <PostCard text="Just realized that CSS Variables are the superpower of modern theming. Never going back to hardcoded hex values." likes="850" comments="22" />
                 </div>
              </motion.div>
            )}

            {/* VIEW: MEDIA */}
            {currentView === "media" && (
              <motion.div 
                key="media"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <StickyHeader title="Media" subtitle="Photos and Videos" />
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                  {MOCK_MEDIA.map((src, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="break-inside-avoid rounded-2xl overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <img 
                        src={src} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt="Gallery"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                        <div className="flex items-center gap-1 font-bold text-sm"><Heart className="w-4 h-4 fill-white" /> 245</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: NETWORK */}
            {currentView.includes("network") && (
              <motion.div 
                key="network"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <StickyHeader title={currentView.replace("network_", "")} subtitle="People in your circle" />

                <div className="relative mb-6">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <input placeholder="Search connections..." className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-2xl text-sm outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(185,132,248,0.2)] transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_USERS.map((user, i) => (
                    <motion.div 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl hover:border-primary/40 hover:bg-secondary/30 transition-all group cursor-pointer"
                    >
                       <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden shrink-0 border border-border">
                         <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm text-foreground truncate">{user.name}</h4>
                         <p className="text-xs text-muted-foreground truncate">{user.handle} • {user.role}</p>
                       </div>
                       <button className="p-2.5 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-white transition-colors">
                         <MessageCircle className="w-4 h-4" />
                       </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   💎 Helper Components
------------------------------------------------------- */

// 🟢 NEW: Sticky Glass Header
const StickyHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 md:-mx-8 px-4 md:px-8 py-6 mb-8 transition-all">
    <h2 className="text-3xl font-bold text-foreground tracking-tight mb-1 capitalize">{title}</h2>
    <p className="text-muted-foreground text-sm">{subtitle}</p>
  </div>
);

const StatBox = ({ label, value, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300
      ${active 
        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
        : "bg-background border-border text-foreground hover:bg-secondary hover:border-border/80"
      }
    `}
  >
    <span className="text-lg font-bold">{value}</span>
    <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</span>
  </button>
);

const NavButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-medium text-sm
      ${active 
        ? "bg-secondary text-foreground font-bold shadow-sm translate-x-2 border border-border/50" 
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:translate-x-1"
      }
    `}
  >
    <Icon className={`w-5 h-5 ${active ? "text-primary" : "opacity-70"}`} />
    {label}
  </button>
);

const CreatePostInput = () => (
  <div className="bg-background border border-border p-4 rounded-[1.5rem] flex gap-4 items-center shadow-sm hover:border-primary/30 transition-colors">
    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground shrink-0 border border-border">A</div>
    <input 
      placeholder="Share your next big idea..." 
      className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50 text-foreground"
    />
    <button className="px-6 py-2 bg-foreground text-background rounded-full text-xs font-bold hover:opacity-90 transition-opacity">Post</button>
  </div>
);

const PostCard = ({ image, text, likes, comments }: { image?: string, text?: string, likes?: string, comments?: string }) => (
  <div className="bg-background border border-border rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-300 group">
    <div className="p-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-secondary p-0.5 overflow-hidden">
         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover rounded-[0.6rem]" alt="" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground flex items-center gap-1">Aaradhya Sen <CheckCheck className="w-3.5 h-3.5 text-primary" /></h4>
        <p className="text-xs text-muted-foreground font-medium">2 hours ago</p>
      </div>
      <button className="ml-auto text-muted-foreground hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
    </div>
    
    {text && <p className="px-5 pb-4 text-sm leading-relaxed text-foreground/90 font-normal">{text}</p>}
    
    {image && (
      <div className="w-full h-[300px] overflow-hidden">
        <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Post" />
      </div>
    )}

    {/* Footer Stats */}
    <div className="px-5 py-4 border-t border-border/50 flex items-center gap-6">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-pink-500 transition-colors cursor-pointer">
        <Heart className="w-4 h-4" /> {likes || 0}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-blue-500 transition-colors cursor-pointer">
        <MessageCircle className="w-4 h-4" /> {comments || 0}
      </div>
      <div className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer">
        <Share2 className="w-4 h-4" />
      </div>
    </div>
  </div>
);