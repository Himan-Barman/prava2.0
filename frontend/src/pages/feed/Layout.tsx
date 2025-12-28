import { Outlet, NavLink } from "react-router-dom";
import { Home, MessageSquare, User, LogOut, PenTool } from "lucide-react";
import { useAuthStore } from "@/entities/session/model/store";
import { Button } from "@/components/ui/Button";

export const FeedLayout = () => {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-white text-black flex justify-center">
      {/* 🟢 LEFT SIDEBAR (Navigation) */}
      <header className="w-[80px] xl:w-[275px] h-screen sticky top-0 flex flex-col p-4 border-r border-gray-100 hidden md:flex">
        <div className="text-3xl font-bold mb-8 px-4">Prava.</div>
        
        <nav className="flex-1 space-y-2">
          <NavItem to="/feed" icon={<Home />} label="Home" />
          <NavItem to="/chat" icon={<MessageSquare />} label="Messages" />
          <NavItem to={`/profile/${user?.username}`} icon={<User />} label="Profile" />
        </nav>

        <Button className="w-full mb-6 rounded-full h-12 text-lg font-bold shadow-lg" variant="primary">
          <span className="hidden xl:inline">Post</span>
          <span className="xl:hidden"><PenTool /></span>
        </Button>

        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors" onClick={logout}>
          <div className="w-10 h-10 rounded-full bg-gray-200" /> {/* Avatar Placeholder */}
          <div className="hidden xl:block overflow-hidden">
            <p className="font-bold text-sm truncate">{user?.displayName}</p>
            <p className="text-xs text-gray-500">@{user?.username}</p>
          </div>
          <LogOut className="w-4 h-4 ml-auto text-gray-400" />
        </div>
      </header>

      {/* 🟢 CENTER (The Feed) */}
      <main className="w-full max-w-[600px] border-r border-gray-100 min-h-screen">
        <Outlet />
      </main>

      {/* 🟢 RIGHT SIDEBAR (Search/Trends) */}
      <aside className="w-[350px] hidden lg:block p-4 pl-8 sticky top-0 h-screen">
        <div className="bg-gray-100 rounded-full h-12 mb-6" /> {/* Search Placeholder */}
        <div className="bg-gray-50 rounded-2xl p-4 min-h-[300px]">
          <h3 className="font-bold text-xl mb-4">Trending for you</h3>
          {/* Trends Placeholder */}
        </div>
      </aside>
    </div>
  );
};

// Helper Component
const NavItem = ({ to, icon, label }: any) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-4 p-3 rounded-full text-xl transition-all ${
        isActive ? "font-bold bg-gray-100" : "font-medium hover:bg-gray-50"
      }`
    }
  >
    {icon}
    <span className="hidden xl:block">{label}</span>
  </NavLink>
);