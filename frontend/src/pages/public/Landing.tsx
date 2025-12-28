import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// 🏎️ The "Rolls Royce" Ease
const luxuryEase = [0.16, 1, 0.3, 1];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: luxuryEase } 
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// 🔓 Custom Animated Lock Component
const AnimatedLock = () => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 3000); // Toggle every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-4 h-4 flex items-center justify-center">
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Lock Body */}
        <path d="M7 11V7a5 5 0 0 1 10 0v4" className="opacity-0" /> {/* Spacer */}
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        
        {/* Animated Shackle */}
        <motion.path
          d="M7 11V7a5 5 0 0 1 10 0v4"
          initial={false}
          animate={{
            y: isLocked ? 0 : -3, // Move up when unlocking
            rotateY: isLocked ? 0 : 180, // Optional flip effect
          }}
          transition={{ duration: 0.5, ease: "circOut" }}
          style={{ originX: 0.8, originY: 1 }} // Pivot point for shackle
        />
      </motion.svg>
    </div>
  );
};

export const Landing = () => {
  return (
    // 🌌 THE MONOLITH CONTAINER
    // Uses 'bg-background' to auto-switch between Obsidian (Dark) and Alabaster (Light)
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-foreground selection:bg-primary selection:text-white flex flex-col justify-between transition-colors duration-700">
      
      {/* 🟢 HEADER (Adaptive Brand) */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: luxuryEase }}
        className="relative z-10 w-full px-6 py-8 md:py-10 flex justify-center items-center"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter">Prava.</h1>
        </div>
      </motion.nav>

      {/* 🟢 MAIN STAGE (Responsive Typography) */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center h-full -mt-10 md:mt-0">
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
          className="flex flex-col items-center space-y-8 md:space-y-12"
        >
          {/* Headline Stack */}
          <div className="space-y-2 md:space-y-4">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight text-muted-foreground/60">
              A new way to connect.
            </motion.h2>
            <motion.h2 variants={fadeInUp} className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-foreground">
              Effortlessly.
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p 
            variants={fadeInUp} 
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xs sm:max-w-xl md:max-w-2xl leading-relaxed font-light"
          >
            A premium messaging experience with elegant UI, real-time encrypted chat, and seamless multi-device login. Designed for modern India.
          </motion.p>

          {/* Action Area (Stacked on Mobile, Row on Desktop) */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-8 items-center w-full sm:w-auto">
            
            {/* Primary Action: Adapts color automatically */}
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-foreground text-background rounded-full font-bold text-lg tracking-wide transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(120,120,120,0.3)] flex items-center justify-center gap-3">
                Create Account <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            {/* Secondary Action */}
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 sm:py-5 text-muted-foreground hover:text-foreground transition-colors text-lg font-medium tracking-wide">
                Login to System
              </button>
            </Link>

          </motion.div>
        </motion.div>
      </main>

      {/* 🟢 FOOTER (Anchored & Animated Lock) */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="relative z-10 w-full py-6 md:py-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          
          {/* Trust Badge */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground/60 px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm">
            <AnimatedLock />
            <span>End-to-end encrypted</span>
          </div>

          <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
            A Himan's Creation • @isrhimanbarman
          </p>
        </div>
      </motion.footer>

    </div>
  );
};