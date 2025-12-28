import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  MessageCircle, 
  Compass, 
  Users, 
  Layers, 
  Bell, 
  Settings, 
  LogOut 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/entities/session/model/store";

// 🚧 MOCK: In production, fetch these from your Backend/Store
// const { notifications } = useNotificationStore();
const MOCK_UNREAD_COUNTS: Record<string, number> = {
  "/chat": 5,          // 5 Unread Messages
  "/notifications": 12, // 12 New Alerts
  "/friends": 1        // 1 Friend Request
};

/* -------------------------------------------------------
   1. Config
------------------------------------------------------- */
const MAIN_NAV = [
  { icon: Home, path: "/feed", label: "Home" },
  { icon: MessageCircle, path: "/chat", label: "Messages" },
  { icon: Compass, path: "/explore", label: "Discover" },
];

const SOCIAL_NAV = [
  { icon: Users, path: "/friends", label: "Friends" },
  { icon: Layers, path: "/groups", label: "Groups" },
];

const UTILITY_NAV = [
  { icon: Bell, path: "/notifications", label: "Activity" },
];

export const Sidebar = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <motion.aside 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 h-screen w-20 bg-[#F4F4F5] dark:bg-[#050505] border-r border-black/5 dark:border-white/5 flex flex-col items-center py-6 z-50 overflow-visible hidden md:flex" // 👈 Added hidden md:flex for Mobile Production Safety
    >
      
      {/* 🟢 BRAND IDENTITY */}
      <div className="mb-8">
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="font-serif text-2xl font-bold text-black dark:text-white tracking-tighter">
            P.
          </span>
        </div>
      </div>

      {/* 🟢 NAVIGATION */}
      <nav className="flex-1 flex flex-col items-center w-full gap-6">
        
        {/* Core */}
        <div className="flex flex-col gap-2 w-full items-center">
          {MAIN_NAV.map((item) => <NavIcon key={item.path} item={item} count={MOCK_UNREAD_COUNTS[item.path]} />)}
        </div>

        <div className="w-4 h-[1px] bg-black/5 dark:bg-white/10" />

        {/* Social */}
        <div className="flex flex-col gap-2 w-full items-center">
          {SOCIAL_NAV.map((item) => <NavIcon key={item.path} item={item} count={MOCK_UNREAD_COUNTS[item.path]} />)}
        </div>

        <div className="w-4 h-[1px] bg-black/5 dark:bg-white/10" />

        {/* Utility */}
        <div className="flex flex-col gap-2 w-full items-center">
          {UTILITY_NAV.map((item) => <NavIcon key={item.path} item={item} count={MOCK_UNREAD_COUNTS[item.path]} />)}
        </div>

      </nav>

      {/* 🟢 BOTTOM ACTIONS */}
      <div className="flex flex-col gap-4 w-full items-center mt-auto pb-4">
        <NavLink 
          to="/settings"
          className={({ isActive }) => `
            relative group flex items-center justify-center w-10 h-10 transition-colors duration-300
            ${isActive ? "text-black dark:text-white" : "text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"}
          `}
        >
          <Settings className="w-5 h-5 transition-transform duration-700 ease-out group-hover:rotate-180" />
          <Tooltip text="Settings" />
        </NavLink>
        
        <button 
          onClick={logout}
          className="relative group flex items-center justify-center w-10 h-10 text-black/20 dark:text-white/20 hover:text-red-500 transition-colors duration-300"
        >
          <LogOut className="w-5 h-5" />
          <Tooltip text="Sign Out" />
        </button>
      </div>
    </motion.aside>
  );
};

/* -------------------------------------------------------
   2. Backend-Ready Icon Component
------------------------------------------------------- */

const NavIcon = ({ item, count }: { item: { icon: any, path: string, label: string }, count?: number }) => (
  <NavLink 
    to={item.path}
    className={({ isActive }) => `
      relative group flex items-center justify-center w-10 h-10 transition-colors duration-500
      ${isActive 
        ? "text-black dark:text-white scale-105" 
        : "text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
      }
    `}
  >
    {({ isActive }) => (
      <>
        <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
        
        {/* 🟢 1. Active Page Indicator (Left Dot) */}
        {isActive && (
          <motion.div 
            layoutId="activeDot"
            className="absolute -right-2 w-1 h-1 bg-black dark:bg-white rounded-full"
          />
        )}

        {/* 🔴 2. BACKEND INTEGRATION: Notification Badge */}
        {/* Only show if inactive (don't distract if already on page) or if you prefer always showing, remove !isActive check */}
        <AnimatePresence>
          {count && count > 0 && !isActive && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F4F4F5] dark:border-[#050505] flex items-center justify-center"
            >
               {/* Optional: Show number if < 9, else show dot */}
               {/* <span className="text-[6px] text-white font-bold">{count > 9 ? '9+' : count}</span> */}
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip text={item.label} />
      </>
    )}
  </NavLink>
);

const Tooltip = ({ text }: { text: string }) => (
  <span className="absolute left-12 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold tracking-wide rounded-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl whitespace-nowrap z-[100]">
    {text}
  </span>
);