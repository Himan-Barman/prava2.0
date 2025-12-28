import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Heart, MessageCircle, Bookmark, Share2, 
  TrendingUp, Sparkles 
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell"; // 👈 Crucial: Handles Layout & Scrolling

/* -------------------------------------------------------
   1. Mock Data & Types
------------------------------------------------------- */
interface ExplorePost {
  id: string;
  image: string;
  height: string; 
  likes: string;
  comments: string;
  user: {
    name: string;
    avatar: string;
  };
  category: string;
}

const CATEGORIES = ["For You", "Architecture", "Cyberpunk", "Minimalism", "Photography", "AI Art", "Fashion"];

const MOCK_POSTS: ExplorePost[] = [
  { 
    id: "1", 
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", 
    height: "aspect-[3/4]", 
    likes: "2.4k", comments: "128", 
    user: { name: "Alex Design", avatar: "A" },
    category: "Architecture"
  },
  { 
    id: "2", 
    image: "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=800&q=80", 
    height: "aspect-[3/2]", 
    likes: "856", comments: "42", 
    user: { name: "Neon Vibes", avatar: "N" },
    category: "Cyberpunk"
  },
  { 
    id: "3", 
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80", 
    height: "aspect-square", 
    likes: "1.2k", comments: "90", 
    user: { name: "Sarah Lens", avatar: "S" },
    category: "Photography"
  },
  { 
    id: "4", 
    image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&q=80", 
    height: "aspect-[9/16]", 
    likes: "4.5k", comments: "340", 
    user: { name: "Modernist", avatar: "M" },
    category: "Minimalism"
  },
  { 
    id: "5", 
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80", 
    height: "aspect-[3/4]", 
    likes: "920", comments: "22", 
    user: { name: "Art Flow", avatar: "A" },
    category: "AI Art"
  },
  { 
    id: "6", 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", 
    height: "aspect-[3/5]", 
    likes: "3.1k", comments: "210", 
    user: { name: "Portrait Pro", avatar: "P" },
    category: "Fashion"
  },
  { 
    id: "7", 
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", 
    height: "aspect-square", 
    likes: "1.8k", comments: "65", 
    user: { name: "Tech Daily", avatar: "T" },
    category: "Cyberpunk"
  },
];

/* -------------------------------------------------------
   2. Main Component
------------------------------------------------------- */
export const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    // 🟢 WRAPPED IN PAGE SHELL: Handles Sidebar spacing (pl-20) and Smooth Scroll
    <PageShell>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        
        {/* 🟢 HEADER & SEARCH (Sticky Glass) */}
        {/* top-16 ensures it sticks below the Navbar, not behind it */}
        <div className="sticky top-16 z-40 pt-8 pb-6 bg-bg-app/90 backdrop-blur-xl transition-colors duration-300 -mx-6 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            
            {/* Title */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2 text-text-primary">
                Discover <Sparkles className="w-6 h-6 text-brand-primary" />
              </h1>
              <p className="text-text-secondary text-sm font-medium">Curated visual experiences.</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`
                relative flex items-center bg-bg-surface border rounded-full transition-all duration-300 w-full md:w-80 h-12
                ${searchFocused 
                  ? "border-brand-primary shadow-[0_0_20px_rgba(126,34,206,0.15)] ring-1 ring-brand-primary/20" 
                  : "border-border-subtle hover:border-border-muted"
                }
              `}
            >
              <Search className={`w-4 h-4 ml-4 transition-colors ${searchFocused ? "text-brand-primary" : "text-text-tertiary"}`} />
              <input 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search tags..." 
                className="w-full bg-transparent border-none py-3 px-3 text-sm focus:outline-none text-text-primary placeholder:text-text-tertiary"
              />
            </motion.div>
          </div>

          {/* Categories (Horizontal Scroll) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar mask-gradient">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border
                  ${activeCategory === cat 
                    ? "bg-text-primary text-bg-app border-text-primary font-bold shadow-md" 
                    : "bg-bg-surface text-text-secondary border-border-subtle hover:border-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 🟢 MASONRY GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {MOCK_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image Container */}
              <div className={`relative w-full ${post.height} overflow-hidden bg-bg-elevated`}>
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                />
                
                {/* Gradient Overlay (Only on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />

                {/* Top Right: Save Button */}
                <div className="absolute top-3 right-3 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                  <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-brand-primary hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Content (Slides Up) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  
                  {/* User Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {post.user.avatar}
                      </div>
                      <span className="text-xs font-bold text-white/90 shadow-black/50 drop-shadow-sm">{post.user.name}</span>
                    </div>
                    <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white/90 font-medium">
                      {post.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.comments}</span>
                    </div>
                    <div className="ml-auto hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Ad/Promo Block (Simulated) */}
          <div className="break-inside-avoid relative rounded-2xl overflow-hidden bg-gradient-to-br from-bg-surface to-bg-elevated border border-border-subtle p-6 text-center min-h-[300px] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-brand-primary/50 transition-colors shadow-sm">
             <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-500 shadow-inner">
                <TrendingUp className="w-7 h-7 text-text-primary group-hover:text-white" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-text-primary mb-1">Trending Topic</h3>
               <p className="text-text-secondary text-sm">#FutureOfAI</p>
             </div>
             <button className="text-xs font-bold text-brand-primary border border-brand-primary px-5 py-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-all uppercase tracking-wide">
               View Thread
             </button>
          </div>
        </div>

      </div>
    </PageShell>
  );
};