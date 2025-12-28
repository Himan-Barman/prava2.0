import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#000000] text-foreground font-sans selection:bg-purple-500/30">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Fixed Navbar */}
      <Navbar />

      {/* 3. Main Content Area */}
      {/* left-padding = 20 (80px) to clear sidebar */}
      {/* top-padding = 20 (80px) to clear navbar */}
      <main className="pl-20 pt-20 min-h-screen relative z-10">
        <div className="p-8 max-w-7xl mx-auto">
          {/* This is where Feed, Chat, Profile will render */}
          <Outlet /> 
        </div>
      </main>

      {/* Global Background Glows */}
      <div className="fixed top-[-20%] left-[0%] w-[50%] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[0%] w-[50%] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
    </div>
  );
};