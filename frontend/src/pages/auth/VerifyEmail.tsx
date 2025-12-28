import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/shared/api/client";

// 🏎️ The "Rolls Royce" Ease
const luxuryEase = [0.16, 1, 0.3, 1];

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  // State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 Minute Timer
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ⏳ Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // ⌨️ OTP Input Handling
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Numbers only
    
    const newOtp = [...otp];
    // Handle paste (e.g., user pastes "123456")
    if (value.length > 1) {
      const pastedData = value.split("").slice(0, 6);
      setOtp([...pastedData, ...new Array(6 - pastedData.length).fill("")]);
      inputRefs.current[5]?.focus(); // Focus last
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace: Focus previous if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 🚀 Verify Action
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    try {
      await api.post("/auth/verify", { email, code });
      toast.success("Identity Verified.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid Code.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Resend Action
  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setTimeLeft(60); // Reset Timer
    setOtp(["", "", "", "", "", ""]); // Clear Inputs
    inputRefs.current[0]?.focus(); // Focus first

    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("New code sent.");
    } catch {
      toast.error("Failed to send code.");
      setCanResend(true); // Re-enable if failed
    }
  };

  // Format Time (mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    // 🌌 THE CONTAINER (Adaptive Theme)
    <div className="relative w-full h-screen overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-700 font-sans selection:bg-purple-500/30">
      
      {/* 🌅 Horizon Line Glow */}
      <div className="absolute top-[60%] left-[-20%] w-[140%] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-6 md:left-10 z-20"
      >
        <Link to="/signup" className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all border border-transparent dark:border-white/5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </motion.div>

      {/* 🟢 THE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: luxuryEase }}
        className="relative z-10 w-full max-w-[440px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
      >
        
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5">
            <Mail className="w-7 h-7 text-black dark:text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-black dark:text-white tracking-tight relative z-10">
          Verify Identity
        </h2>
        <p className="text-center text-sm text-black/40 dark:text-white/40 mb-8 relative z-10 max-w-[80%] mx-auto">
          Enter the secure code sent to <br/> 
          <span className="text-black dark:text-white font-medium">{email}</span>
        </p>

        {/* 2. The OTP Form */}
        <form onSubmit={handleVerify} className="space-y-8 relative z-10">
          
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl text-black dark:text-white shadow-sm focus:outline-none focus:scale-105 transition-all caret-black dark:caret-white"
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-sm font-mono text-black/40 dark:text-white/40">
              <RefreshCw className={`w-3 h-3 ${loading || !canResend ? "animate-spin" : ""}`} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-medium transition-colors ${
                canResend 
                  ? "text-black dark:text-white hover:underline cursor-pointer" 
                  : "text-black/20 dark:text-white/20 cursor-not-allowed"
              }`}
            >
              Resend Code
            </button>
          </div>

          {/* 3. The Action Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full h-12 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Access"}
          </button>

        </form>
      </motion.div>
    </div>
  );
};