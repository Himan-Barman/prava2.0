import { motion } from "framer-motion";
import { UserMinus, MessageCircle } from "lucide-react";

const MOCK_FRIENDS = [
  { id: 1, name: "Aaradhya Sen", role: "Designer" },
  { id: 2, name: "Rohan Das", role: "Developer" },
  { id: 3, name: "Vikram Singh", role: "Product" },
  { id: 4, name: "Priya K", role: "Artist" },
];

export const Friends = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
          <p className="text-black/40 dark:text-white/40">Your trusted circle.</p>
        </div>
        <span className="px-4 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-xs font-bold text-black/60 dark:text-white/60">
          {MOCK_FRIENDS.length} Connections
        </span>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_FRIENDS.map((friend, i) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 mx-auto mb-4 flex items-center justify-center font-bold text-xl">
              {friend.name[0]}
            </div>
            <h3 className="text-center font-bold">{friend.name}</h3>
            <p className="text-center text-xs text-black/40 dark:text-white/40 mb-6">{friend.role}</p>
            
            <div className="flex gap-2 justify-center">
              <button className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                <UserMinus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};