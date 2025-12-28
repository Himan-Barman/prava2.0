import { motion } from "framer-motion";
import { Layers, Users } from "lucide-react";

export const Groups = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-black/40 dark:text-white/40">Communities you might like.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-48 rounded-3xl overflow-hidden bg-black cursor-pointer"
          >
            {/* Background Image Placeholder */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-60 group-hover:scale-110 transition-transform duration-700`} />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
               <h3 className="font-bold text-lg">Design Systems {i}</h3>
               <div className="flex items-center gap-2 text-white/60 text-xs">
                 <Users className="w-3 h-3" />
                 <span>1.2k Members</span>
               </div>
            </div>
            
            <button className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white hover:bg-white/30 transition-colors">
              Join
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};