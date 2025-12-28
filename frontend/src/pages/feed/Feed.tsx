import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MessageCircle, Repeat2, Share, MoreHorizontal, 
  Image as ImageIcon, Smile, BarChart2, Calendar, MapPin, 
  BadgeCheck, TrendingUp 
} from "lucide-react";

/* -------------------------------------------------------
   1. Mock Data & Types
------------------------------------------------------- */
interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  stats: {
    likes: number;
    comments: number;
    reposts: number;
    views: string;
  };
}

const MOCK_FEED: Post[] = [
  {
    id: "1",
    author: { name: "Aaradhya Sen", handle: "@aaradhya_ai", avatar: "A", verified: true },
    content: "Just deployed the new Prava 2.0 architecture. ScyllaDB + Redis Cluster is an absolute beast for handling 100k+ concurrent connections. 🚀 #SystemDesign #Tech",
    timestamp: "2h",
    stats: { likes: 1240, comments: 85, reposts: 140, views: "12.5k" }
  },
  {
    id: "2",
    author: { name: "Design Daily", handle: "@designdaily", avatar: "D", verified: false },
    content: "Minimalism isn't about removing things you love. It's about removing the things that distract you from the things you love.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop",
    timestamp: "4h",
    stats: { likes: 8560, comments: 342, reposts: 1200, views: "85k" }
  },
  {
    id: "3",
    author: { name: "Elon Musk", handle: "@elonmusk", avatar: "E", verified: true },
    content: "True freedom of speech is the bedrock of a functioning democracy.",
    timestamp: "6h",
    stats: { likes: 45000, comments: 5200, reposts: 12000, views: "1.2M" }
  }
];

const TRENDS = [
  { category: "Technology • Trending", tag: "#PravaLaunch", posts: "52.4K posts" },
  { category: "Politics • Trending", tag: "#Elections2025", posts: "1.2M posts" },
  { category: "Design", tag: "Figma Config", posts: "12K posts" },
  { category: "Sports", tag: "CricketWorldCup", posts: "85K posts" },
];

/* -------------------------------------------------------
   2. Main Component
------------------------------------------------------- */
export const Feed = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e5e5e5] font-sans flex justify-center">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />

      <div className="w-full max-w-[1200px] flex gap-8 px-4 relative z-10">
        
        {/* 🟢 MAIN FEED (Center) */}
        <main className="flex-1 max-w-[600px] border-x border-[#1f1f1f] min-h-screen">
          
          {/* Header */}
          <div className="sticky top-0 z-30 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-[#1f1f1f] px-4 py-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
            <h2 className="text-xl font-bold tracking-tight">Home</h2>
          </div>

          {/* Composer (Create Post) */}
          <div className="p-4 border-b border-[#1f1f1f]">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#b984f8] to-[#7c3aed] flex items-center justify-center font-bold text-white shrink-0">
                A
              </div>
              <div className="flex-1">
                <textarea 
                  placeholder="What is happening?!" 
                  className="w-full bg-transparent text-lg text-[#e5e5e5] placeholder:text-[#6a6372] focus:outline-none resize-none min-h-[60px]"
                />
                
                {/* Composer Tools */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-[#b984f8]">
                    <ToolButton icon={<ImageIcon size={18} />} />
                    <ToolButton icon={<BarChart2 size={18} />} />
                    <ToolButton icon={<Smile size={18} />} />
                    <ToolButton icon={<Calendar size={18} />} />
                    <ToolButton icon={<MapPin size={18} />} />
                  </div>
                  <button className="px-5 py-1.5 bg-[#b984f8] hover:bg-[#a06cd5] text-white font-bold rounded-full text-sm transition-colors shadow-[0_0_15px_rgba(185,132,248,0.3)]">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Stream */}
          <div>
            {MOCK_FEED.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </main>

        {/* 🟢 RIGHT SIDEBAR (Trends) */}
        <aside className="hidden lg:block w-[350px] py-4 space-y-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
          
          {/* Search */}
          <div className="bg-[#1d1d1d] rounded-full px-5 py-3 flex items-center gap-3 border border-transparent focus-within:border-[#b984f8] focus-within:bg-[#0c0c0c] transition-all group">
            <TrendingUp className="w-4 h-4 text-[#6a6372] group-focus-within:text-[#b984f8]" />
            <input placeholder="Search" className="bg-transparent focus:outline-none text-sm w-full placeholder:text-[#6a6372]" />
          </div>

          {/* Trends Card */}
          <div className="bg-[#1d1d1d] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <h3 className="px-4 py-3 text-lg font-bold border-b border-[#2a2a2a]">Trends for you</h3>
            
            {TRENDS.map((trend, i) => (
              <div key={i} className="px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer transition-colors relative">
                <div className="textxs text-[#6a6372] text-[11px] flex justify-between">
                  {trend.category}
                  <MoreHorizontal className="w-4 h-4 hover:text-[#b984f8]" />
                </div>
                <div className="font-bold text-[15px] mt-0.5 text-[#e5e5e5]">{trend.tag}</div>
                <div className="text-[11px] text-[#6a6372] mt-0.5">{trend.posts}</div>
              </div>
            ))}
            
            <div className="px-4 py-3 text-[#b984f8] text-sm cursor-pointer hover:underline">Show more</div>
          </div>

          {/* Who to Follow */}
          <div className="bg-[#1d1d1d] rounded-2xl border border-[#2a2a2a] p-4">
            <h3 className="text-lg font-bold mb-4">Who to follow</h3>
            <div className="space-y-4">
               <FollowSuggestion name="MERN Stack" handle="@mern_devs" />
               <FollowSuggestion name="React Team" handle="@reactjs" />
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

/* -------------------------------------------------------
   3. Sub-Components
------------------------------------------------------- */

const PostCard = ({ post, index }: { post: Post, index: number }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
      className="p-4 border-b border-[#1f1f1f] hover:bg-[#111] transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center font-bold text-[#e5e5e5] shrink-0 border border-[#333]">
          {post.author.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[15px]">
            <span className="font-bold text-[#e5e5e5] hover:underline decoration-[#e5e5e5]">{post.author.name}</span>
            {post.author.verified && <BadgeCheck className="w-4 h-4 text-[#b984f8] fill-current" />}
            <span className="text-[#6a6372]">{post.author.handle}</span>
            <span className="text-[#6a6372]">·</span>
            <span className="text-[#6a6372] hover:underline">{post.timestamp}</span>
            <button className="ml-auto text-[#6a6372] hover:text-[#b984f8] group rounded-full p-1 hover:bg-[#b984f8]/10 transition-colors">
               <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-1 text-[#e5e5e5] text-[15px] leading-relaxed whitespace-pre-wrap">
            {parseHashtags(post.content)}
          </p>

          {post.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-lg">
              <img src={post.image} alt="Post content" className="w-full h-auto hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-3 max-w-[450px] text-[#6a6372]">
             <ActionButton icon={<MessageCircle size={18} />} count={post.stats.comments} color="blue" />
             <ActionButton icon={<Repeat2 size={18} />} count={post.stats.reposts} color="green" />
             <ActionButton icon={<Heart size={18} />} count={post.stats.likes} color="pink" />
             <ActionButton icon={<Share size={18} />} count={post.stats.views} color="blue" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const ToolButton = ({ icon }: { icon: any }) => (
  <button className="p-2 rounded-full hover:bg-[#b984f8]/10 transition-colors">
    {icon}
  </button>
);

const ActionButton = ({ icon, count, color }: { icon: any, count: number | string, color: string }) => {
  const hoverColors: Record<string, string> = {
    blue: "group-hover:text-blue-400 group-hover:bg-blue-500/10",
    green: "group-hover:text-green-400 group-hover:bg-green-500/10",
    pink: "group-hover:text-pink-400 group-hover:bg-pink-500/10",
  };

  return (
    <div className={`flex items-center gap-1 group cursor-pointer transition-colors text-xs ${hoverColors[color]}`}>
      <div className={`p-2 rounded-full transition-colors ${hoverColors[color].split(" ")[1]}`}>
        {icon}
      </div>
      <span>{count}</span>
    </div>
  );
};

const FollowSuggestion = ({ name, handle }: { name: string, handle: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />
      <div className="leading-tight">
        <div className="font-bold text-sm text-[#e5e5e5] hover:underline">{name}</div>
        <div className="text-[#6a6372] text-xs">{handle}</div>
      </div>
    </div>
    <button className="px-4 py-1.5 bg-[#e5e5e5] text-black text-xs font-bold rounded-full hover:bg-white transition-colors">
      Follow
    </button>
  </div>
);

// Utility to color hashtags
const parseHashtags = (text: string) => {
  return text.split(" ").map((word, i) => 
    word.startsWith("#") ? <span key={i} className="text-[#b984f8]">{word} </span> : word + " "
  );
};