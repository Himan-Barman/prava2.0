// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import { Loader2, Lock, User } from "lucide-react";
// import { toast } from "sonner";
// import { api } from "@/shared/api/client";
// import { useAuthStore } from "@/entities/session/model/store"; // Assumed existing from your previous code

// // 🏎️ The "Rolls Royce" Ease
// const luxuryEase = [0.16, 1, 0.3, 1];

// export const Login = () => {
//   const navigate = useNavigate();
//   const login = useAuthStore((s) => s.login); // Connect to your auth store
  
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const canSubmit = identifier.length > 3 && password.length > 5 && !loading;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!canSubmit) return;

//     setLoading(true);
//     try {
//       // API Call
//       const res = await api.post("/auth/login", { identifier, password });
      
//       // Store Session
//       login(res.data.token, res.data.user);
      
//       toast.success("Welcome back.");
//       navigate("/feed"); // Redirect to main app
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Access Denied.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // 🌌 THE CONTAINER (Matches Signup exactly for seamless transition)
//     <div className="relative w-full h-screen overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-700 font-sans selection:bg-purple-500/30">
      
//       {/* 🌅 Horizon Line Glow */}
//       <div className="absolute top-[60%] left-[-20%] w-[140%] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

//       {/* 🟢 THE CARD */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, ease: luxuryEase }}
//         className="relative z-10 w-full max-w-[420px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
//       >
        
//         {/* 1. Toggle Pill (Active on Right) */}
//         <div className="flex justify-center mb-8 relative z-10">
//           <div className="bg-white dark:bg-[#1A1A1A] p-1 rounded-full flex relative shadow-sm border border-black/5 dark:border-white/5">
//             {/* Active Indicator (Moved to Right) */}
//             <motion.div 
//               layoutId="activePill" // Shared ID creates smooth morph if navigating
//               className="absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] bg-[#E4E4E7] dark:bg-[#2A2A2A] rounded-full shadow-sm"
//             />
            
//             <Link to="/signup">
//               <button className="relative z-10 px-6 py-2 text-sm font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
//                 Sign up
//               </button>
//             </Link>
//             <button className="relative z-10 px-6 py-2 text-sm font-medium text-black dark:text-white transition-colors">
//               Sign in
//             </button>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold text-center mb-2 text-black dark:text-white tracking-tight relative z-10">
//           Welcome back
//         </h2>
//         <p className="text-center text-sm text-black/40 dark:text-white/40 mb-8 relative z-10">
//           Enter the silent network.
//         </p>

//         {/* 2. The Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
//           {/* Identity Input */}
//           <div className="relative group">
//             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
//             <input
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder="Username or Email"
//               className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
//             />
//           </div>

//           {/* Password Input */}
//           <div className="relative group">
//             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
//             />
//           </div>

//           {/* Forgot Password Link */}
//           <div className="flex justify-end">
//             <Link 
//               to="/forgot-password" 
//               className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           {/* 3. The Action Button */}
//           <button
//             type="submit"
//             disabled={!canSubmit}
//             className="w-full h-12 mt-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
//           >
//             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter System"}
//           </button>

//           {/* Footer */}
//           <p className="text-center text-[11px] text-black/30 dark:text-white/30 mt-6 px-4 leading-relaxed tracking-wide">
//             SECURE • PRIVATE • ENCRYPTED
//           </p>

//         </form>
//       </motion.div>
//     </div>
//   );
// };





import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock, User, Zap } from "lucide-react"; 
import { toast } from "sonner";
import { api } from "@/shared/api/client";
import { useAuthStore } from "@/entities/session/model/store";

// 🏎️ The "Rolls Royce" Ease
const luxuryEase = [0.16, 1, 0.3, 1];

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚡ DEV TOOL: Quick Login Handler
  const handleDevLogin = () => {
    setIdentifier("himanbarman"); 
    setPassword("123456");      
    toast.info("⚡ Dev Credentials Filled");
  };

  // ✅ UPDATED: Relaxed validation for Dev Mode so you can click button easily
  const canSubmit = (identifier.length > 0 && password.length > 0) || (import.meta as any).env.DEV;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚧 1. DEV BYPASS (Forces entry without Backend)
      if (true) { // Always true for now
        
        // Fake a delay for realism
        await new Promise(r => setTimeout(r, 800)); 
        
        // Fake the session so ProtectedRoute lets us in
        login("dev_fake_token", { 
          id: "dev_id", 
          name: "Developer Admin", 
          username: "admin", 
          email: "dev@local.com" 
        } as any);

        toast.success("⚡ Dev Access Granted.");
        navigate("/feed");
        return; // Stop here, don't call real API
      }

      /* 🔒 REAL BACKEND LOGIC (Commented Out for Dev Purpose)
      const res = await api.post("/auth/login", { identifier, password });
      login(res.data.token, res.data.user);
      toast.success("Welcome back.");
      navigate("/feed");
      */

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 THE CONTAINER
    <div className="relative w-full h-screen overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-700 font-sans selection:bg-purple-500/30">
      
      {/* 🌅 Horizon Glow */}
      <div className="absolute top-[60%] left-[-20%] w-[140%] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 🟢 THE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: luxuryEase }}
        className="relative z-10 w-full max-w-[420px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
      >
        
        {/* ⚡ DEV BUTTON */}
        {(import.meta as any).env.DEV && (
            <button 
                type="button"
                onClick={handleDevLogin}
                className="absolute top-6 right-6 p-2 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 transition-colors z-50"
                title="Dev: Quick Login"
            >
                <Zap className="w-4 h-4" />
            </button>
        )}

        {/* Toggle Pill */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-white dark:bg-[#1A1A1A] p-1 rounded-full flex relative shadow-sm border border-black/5 dark:border-white/5">
            <motion.div 
              layoutId="activePill"
              className="absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] bg-[#E4E4E7] dark:bg-[#2A2A2A] rounded-full shadow-sm"
            />
            <Link to="/signup">
              <button className="relative z-10 px-6 py-2 text-sm font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                Sign up
              </button>
            </Link>
            <button className="relative z-10 px-6 py-2 text-sm font-medium text-black dark:text-white transition-colors">
              Sign in
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-black dark:text-white tracking-tight relative z-10">
          Welcome back
        </h2>
        <p className="text-center text-sm text-black/40 dark:text-white/40 mb-8 relative z-10">
          Enter the silent network.
        </p>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or Email"
              className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 mt-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter System"}
          </button>

          <p className="text-center text-[11px] text-black/30 dark:text-white/30 mt-6 px-4 leading-relaxed tracking-wide">
            SECURE • PRIVATE • ENCRYPTED
          </p>

        </form>
      </motion.div>
    </div>
  );
};