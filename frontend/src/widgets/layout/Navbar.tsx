import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, X, UserPlus, MessageCircle, Clock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/entities/session/model/store";
import { Link } from "react-router-dom";

/* -------------------------------------------------------
   1. TypeScript Interfaces (Backend Ready)
------------------------------------------------------- */
type FriendStatus = "NONE" | "FRIEND" | "REQUESTED";

interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: FriendStatus;
}

// 🚧 MOCK DATABASE (Replace with real API calls)
const MOCK_DB: SearchResult[] = [
  { id: "1", name: "Aaradhya Sen", username: "@aaradhya", avatar: "A", status: "NONE" },
  { id: "2", name: "Rohan Das", username: "@rohan_d", avatar: "R", status: "FRIEND" },
  { id: "3", name: "Priya K", username: "@priya_k", avatar: "P", status: "REQUESTED" },
  { id: "4", name: "Vikram Singh", username: "@vikram", avatar: "V", status: "NONE" },
];

/* -------------------------------------------------------
   2. Main Component: The Phantom Navbar
------------------------------------------------------- */
export const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  // Safe optional chaining for user initial
  const initial = (user as any)?.name?.[0] || "U";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      // 🎨 STYLE: Ultra-Narrow (h-16), Glassmorphism, Borderless feeling
      className="fixed top-0 left-20 right-0 h-16 px-8 flex items-center justify-between z-[100] bg-white/90 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5"
    >
      {/* 1. Context / Breadcrumbs */}
      <div className="hidden md:flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
        <span className="text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-widest">
          Silent Network
        </span>
        <span className="text-xs text-black/20 dark:text-white/20">•</span>
        <span className="text-xs font-bold text-black dark:text-white">Feed</span>
      </div>

      {/* 2. The Smart Search Engine */}
      <div className="flex-1 max-w-lg mx-auto">
        <SmartSearch />
      </div>

      {/* 3. User & Actions */}
      <div className="flex items-center gap-5">
        <button className="relative text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black scale-0 group-hover:scale-100 transition-transform" />
        </button>

        <Link to="/profile">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-white dark:from-[#333] dark:to-[#111] border border-black/5 dark:border-white/10 flex items-center justify-center text-xs font-bold text-black dark:text-white shadow-sm ring-2 ring-transparent hover:ring-black/5 dark:hover:ring-white/10 transition-all cursor-pointer">
            {initial}
          </div>
        </Link>
      </div>
    </motion.header>
  );
};

/* -------------------------------------------------------
   3. Smart Search Component (The Brain)
------------------------------------------------------- */
const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulated Search API
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setIsOpen(true);

    // Debounce simulation
    const timer = setTimeout(() => {
      const filtered = MOCK_DB.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full z-50">

      {/* 🔎 The Input Field */}
      <div className={`
        relative flex items-center h-10 w-full transition-all duration-300
        ${isOpen ? "bg-white dark:bg-[#1A1A1A] shadow-xl scale-[1.02]" : "bg-[#F4F4F5] dark:bg-[#121212]"}
        border border-transparent ${isOpen ? "border-black/5 dark:border-white/5" : ""}
        rounded-xl
      `}>
        <Search className={`absolute left-3 w-4 h-4 transition-colors ${isOpen ? "text-black dark:text-white" : "text-black/30 dark:text-white/30"}`} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search for people..."
          className="w-full h-full bg-transparent pl-10 pr-10 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none rounded-xl"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
              className="absolute right-3 p-0.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white"
            >
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 📜 The Results Popup (Flexible & Smart) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden min-h-[100px] max-h-[400px] flex flex-col"
          >
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center p-8 text-black/40 dark:text-white/40 gap-2 text-xs font-medium uppercase tracking-wider">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && query && (
              <div className="p-8 text-center text-black/40 dark:text-white/40 text-sm">
                No users found.
              </div>
            )}

            {/* Results List */}
            {!loading && results.map((user) => (
              <ResultRow key={user.id} user={user} />
            ))}

            {/* Footer */}
            {!loading && results.length > 0 && (
              <div className="p-2 bg-gray-50 dark:bg-[#111] border-t border-black/5 dark:border-white/5 text-center">
                <span className="text-[10px] text-black/30 dark:text-white/30 font-medium uppercase tracking-widest">
                  Press Enter for more results
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------------------------------
   4. Smart Result Row (Stabilized Button Size)
------------------------------------------------------- */
const ResultRow = ({ user }: { user: SearchResult }) => {
  // Local state for optimistic updates
  const [status, setStatus] = useState<FriendStatus>(user.status);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // 🖱️ Button Handler
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. If currently "Requested", clicking triggers Confirmation Mode
    if (status === "REQUESTED" && !confirmCancel) {
      setConfirmCancel(true);
      return;
    }

    // 2. If Confirmation "Undo?" is clicked -> Remove Request
    if (status === "REQUESTED" && confirmCancel) {
      setStatus("NONE");
      setConfirmCancel(false);
      // TODO: Call API to cancel request
      return;
    }

    // 3. If "Add Friend" -> Send Request
    if (status === "NONE") {
      setStatus("REQUESTED");
      // TODO: Call API to send request
      return;
    }

    // 4. If Friend -> Open Chat (Navigate)
    if (status === "FRIEND") {
      console.log("Navigating to chat...");
      // navigate(`/chat/${user.id}`)
    }
  };

  // Reset confirmation if mouse leaves the area
  const handleMouseLeave = () => setConfirmCancel(false);

  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-sm font-bold text-black dark:text-white">
          {user.avatar}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-black dark:text-white leading-none">
            {user.name}
          </span>
          <span className="text-xs text-black/40 dark:text-white/40 mt-1">
            {user.username}
          </span>
        </div>
      </div>

      {/* ⚡ STABILIZED BUTTON: Fixed width (w-28) prevents resizing/jitter */}
      <motion.button
        layout
        onClick={handleAction}
        className={`
          relative h-8 w-28 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 overflow-hidden
          ${
          // 🎨 Dynamic Coloring based on Status
          status === "FRIEND"
            ? "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
            : status === "REQUESTED"
              ? confirmCancel
                ? "bg-red-500 text-white" // Destructive Mode
                : "bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-red-500/10 hover:text-red-500" // Passive Mode
              : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90" // Add Mode
          }
        `}
      >
        <AnimatePresence mode="wait">

          {/* STATE: FRIEND */}
          {status === "FRIEND" && (
            <motion.div
              key="friend"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Message</span>
            </motion.div>
          )}

          {/* STATE: REQUESTED */}
          {status === "REQUESTED" && (
            <motion.div
              key="requested"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              {confirmCancel ? (
                // 🛑 Sub-State: Confirmation
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Undo?</span>
                </>
              ) : (
                // ⏳ Sub-State: Passive
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Requested</span>
                </>
              )}
            </motion.div>
          )}

          {/* STATE: NONE (Add) */}
          {status === "NONE" && (
            <motion.div
              key="add"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};