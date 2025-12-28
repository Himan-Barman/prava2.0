import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/shared/api/client";

// 🏎️ The "Rolls Royce" Ease
const luxuryEase = [0.16, 1, 0.3, 1];

export const SetPassword = () => {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = password.length > 5 && password === confirmPassword && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Assuming you pass a token via URL query params or similar for password reset
      await api.post("/auth/set-password", { password });
      toast.success("Security Updated.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 THE CONTAINER (Adaptive Theme)
    <div className="relative w-full h-screen overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-700 font-sans selection:bg-purple-500/30">
      
      {/* 🌅 Horizon Glow */}
      <div className="absolute top-[60%] left-[-20%] w-[140%] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
      
      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-6 md:left-10 z-20"
      >
        <Link to="/login" className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black/60 dark:text-white/60 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* 🟢 THE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: luxuryEase }}
        className="relative z-10 w-full max-w-[420px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
      >
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5">
            <ShieldCheck className="w-7 h-7 text-black dark:text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-black dark:text-white tracking-tight relative z-10">
          Secure Account
        </h2>
        <p className="text-center text-sm text-black/40 dark:text-white/40 mb-8 relative z-10">
          Create a new, strong password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Confirm */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full bg-white dark:bg-[#1A1A1A] border ${password && confirmPassword && password !== confirmPassword ? "border-red-500/30" : "border-transparent"} focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm`}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 mt-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Credentials"}
          </button>

        </form>
      </motion.div>
    </div>
  );
};