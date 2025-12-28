// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import { Loader2, Check, X, ChevronDown } from "lucide-react";
// import { toast } from "sonner";
// import { api } from "@/shared/api/client";

// // 🏎️ The "Rolls Royce" Ease
// const luxuryEase = [0.16, 1, 0.3, 1];

// // 🌍 Supported Countries
// const COUNTRIES = [
//   { code: "IN", dial: "+91", name: "India" },
//   { code: "US", dial: "+1", name: "USA" },
//   { code: "UK", dial: "+44", name: "UK" },
//   { code: "CA", dial: "+1", name: "Canada" },
// ];

// /* -------------------------------------------------------
//    Types & Config
// ------------------------------------------------------- */
// type UsernameStatus = "idle" | "checking" | "available" | "unavailable";
// const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/; 
// const USERNAME_DEBOUNCE_MS = 500;

// export const Signup = () => {
//   const navigate = useNavigate();
  
//   // State
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [username, setUsername] = useState("");
//   const [emailLocal, setEmailLocal] = useState("");
//   const [phone, setPhone] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
//   const [isCountryOpen, setIsCountryOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Logic
//   const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
//   const debounceRef = useRef<number | null>(null);
//   const lastCheckedUsername = useRef<string>("");

//   const isUsernameValid = USERNAME_REGEX.test(username);
//   const canSubmit = firstName && lastName && usernameStatus === "available" && emailLocal.length > 3 && phone.length > 5 && !loading;

//   // --- Handlers ---
//   const handleUsernameChange = (val: string) => {
//     const clean = val.toLowerCase().replace(/[^a-z0-9._]/g, "");
//     setUsername(clean);
//     setUsernameStatus("idle");
//   };

//   const handleEmailChange = (val: string) => {
//     const clean = val.replace(/[@\s]/g, "");
//     setEmailLocal(clean);
//   };

//   useEffect(() => {
//     if (!isUsernameValid) { setUsernameStatus("idle"); return; }
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     setUsernameStatus("checking");
//     debounceRef.current = window.setTimeout(async () => {
//       const current = username;
//       lastCheckedUsername.current = current;
//       try {
//         const res = await api.get("/auth/username-available", { params: { username: current } });
//         if (lastCheckedUsername.current !== current) return;
//         setUsernameStatus(res.data?.available ? "available" : "unavailable");
//       } catch { setUsernameStatus("idle"); }
//     }, USERNAME_DEBOUNCE_MS);
//     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
//   }, [username, isUsernameValid]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!canSubmit) return;
//     setLoading(true);
//     const fullEmail = `${emailLocal}@gmail.com`;
//     const fullPhone = `${selectedCountry.dial}${phone}`;
//     try {
//       await api.post("/auth/signup", {
//         name: `${firstName.trim()} ${lastName.trim()}`,
//         username, email: fullEmail, phone: fullPhone,
//       });
//       toast.success("Identity Created.");
//       navigate("/verify-email", { state: { email: fullEmail } });
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed.");
//     } finally { setLoading(false); }
//   };

//   return (
//     // 🌌 THE CONTAINER
//     // Light Mode: Pure White (#FFFFFF)
//     // Dark Mode: Pure Black (#000000)
//     <div className="relative w-full h-screen overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-700 font-sans selection:bg-purple-500/30">
      
//       {/* 🌅 Horizon Line Glow (Subtle & Premium) */}
//       <div className="absolute top-[60%] left-[-20%] w-[140%] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

//       {/* 🟢 THE CARD */}
//       {/* Light Mode: Premium Platinum (#F4F4F5) -> Darker than BG */}
//       {/* Dark Mode: Obsidian Glass (#121212) -> Lighter than BG */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.8, ease: luxuryEase }}
//         className="relative z-10 w-full max-w-[440px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
//       >
        
//         {/* 1. Toggle Pill */}
//         <div className="flex justify-center mb-8 relative z-10">
//           <div className="bg-white dark:bg-[#1A1A1A] p-1 rounded-full flex relative shadow-sm border border-black/5 dark:border-white/5">
//             {/* Active Indicator */}
//             <motion.div 
//               layoutId="activePill"
//               className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#E4E4E7] dark:bg-[#2A2A2A] rounded-full shadow-sm"
//             />
            
//             <button className="relative z-10 px-6 py-2 text-sm font-medium text-black dark:text-white transition-colors">
//               Sign up
//             </button>
//             <Link to="/login">
//               <button className="relative z-10 px-6 py-2 text-sm font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
//                 Sign in
//               </button>
//             </Link>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white tracking-tight relative z-10">
//           Create an account
//         </h2>

//         {/* 2. The Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
//           {/* Names Row */}
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="First Name"
//               className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
//             />
//             <input
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               placeholder="Last Name"
//               className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
//             />
//           </div>

//           {/* Username (Instagram Style) */}
//           <div className="relative group">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 text-sm select-none">@</span>
//             <input
//               value={username}
//               onChange={(e) => handleUsernameChange(e.target.value)}
//               placeholder="username"
//               className={`w-full bg-white dark:bg-[#1A1A1A] border ${usernameStatus === 'unavailable' ? 'border-red-500/30' : 'border-transparent'} focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-8 pr-10 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm`}
//             />
//             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//               {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-black/30 dark:text-white/30" />}
//               {usernameStatus === "available" && <Check className="w-4 h-4 text-emerald-500" />}
//               {usernameStatus === "unavailable" && <X className="w-4 h-4 text-red-500" />}
//             </div>
//           </div>

//           {/* Email (Locked Domain) */}
//           <div className="flex items-center bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden border border-transparent focus-within:border-black/10 dark:focus-within:border-white/10 transition-all shadow-sm">
//             <input
//               value={emailLocal}
//               onChange={(e) => handleEmailChange(e.target.value)}
//               placeholder="john.doe"
//               className="flex-1 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none"
//             />
//             <div className="px-4 py-3 bg-gray-50 dark:bg-[#222] text-black/40 dark:text-white/40 text-sm border-l border-gray-100 dark:border-white/5 select-none">
//               @gmail.com
//             </div>
//           </div>

//           {/* Mobile (Country Dropdown) */}
//           <div className="flex gap-2">
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setIsCountryOpen(!isCountryOpen)}
//                 className="h-full px-3 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl flex items-center gap-2 text-black dark:text-white border border-transparent shadow-sm transition-colors min-w-[80px] justify-between"
//               >
//                 <span className="text-sm font-medium">{selectedCountry.dial}</span>
//                 <ChevronDown className={`w-3 h-3 text-black/40 dark:text-white/40 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
//               </button>
              
//               <AnimatePresence>
//                 {isCountryOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 5 }}
//                     className="absolute bottom-full mb-2 left-0 w-[180px] bg-white dark:bg-[#222] border border-black/5 dark:border-white/5 rounded-xl shadow-xl py-1 z-50 overflow-hidden"
//                   >
//                     {COUNTRIES.map((c) => (
//                       <button
//                         key={c.code}
//                         type="button"
//                         onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
//                         className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
//                       >
//                         <span className="text-black dark:text-white text-sm">{c.dial}</span>
//                         <span className="text-black/40 dark:text-white/40 text-xs ml-auto">{c.code}</span>
//                       </button>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
            
//             <input
//               value={phone}
//               onChange={(e) => { if (/^\d*$/.test(e.target.value)) setPhone(e.target.value); }}
//               placeholder="Mobile Number"
//               className="flex-1 bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
//             />
//           </div>

//           {/* 3. The Action Button (Adaptive) */}
//           <button
//             type="submit"
//             disabled={!canSubmit}
//             className="w-full h-12 mt-6 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
//           >
//             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create an account"}
//           </button>

//           {/* Footer Terms */}
//           <p className="text-center text-[11px] text-black/30 dark:text-white/30 mt-4 px-4 leading-relaxed">
//             By creating an account, you agree to our Terms & Service. <br/>
//             Secure • Private • Encrypted
//           </p>

//         </form>
//       </motion.div>
//     </div>
//   );
// };




import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Check, X, ChevronDown, Zap } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/shared/api/client";

// 🏎️ The "Rolls Royce" Ease
const luxuryEase = [0.16, 1, 0.3, 1];

// 🌍 Supported Countries
const COUNTRIES = [
  { code: "IN", dial: "+91", name: "India" },
  { code: "US", dial: "+1", name: "USA" },
  { code: "UK", dial: "+44", name: "UK" },
  { code: "CA", dial: "+1", name: "Canada" },
];

/* -------------------------------------------------------
   Types & Config
------------------------------------------------------- */
type UsernameStatus = "idle" | "checking" | "available" | "unavailable";
const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/; 
const USERNAME_DEBOUNCE_MS = 500;

export const Signup = () => {
  const navigate = useNavigate();
  
  // State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logic
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const debounceRef = useRef<number | null>(null);
  const lastCheckedUsername = useRef<string>("");

  const isUsernameValid = USERNAME_REGEX.test(username);

  // ⚡ Button Enables Immediately (Doesn't wait for server check)
  const canSubmit = 
    firstName.length > 0 && 
    lastName.length > 0 && 
    username.length > 3 && 
    emailLocal.length > 0 && 
    phone.length > 5 && 
    !loading;

  // ⚡ DEV TOOL: Generator
  const handleDevFill = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const names = ["Alex", "Jordan", "Taylor", "Morgan", "Casey"];
    const name = names[Math.floor(Math.random() * names.length)];
    
    setFirstName(name);
    setLastName("Dev");
    setUsername(`${name.toLowerCase()}_${randomId}`);
    setEmailLocal(`${name.toLowerCase()}.${randomId}`);
    setPhone(`98${Math.floor(10000000 + Math.random() * 90000000)}`);
    
    toast.info("⚡ Dev Identity Generated");
  };

  // --- Handlers ---
  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9._]/g, "");
    setUsername(clean);
    setUsernameStatus("idle");
  };

  const handleEmailChange = (val: string) => {
    const clean = val.replace(/[@\s]/g, "");
    setEmailLocal(clean);
  };

  // Live Username Check
  useEffect(() => {
    if (!isUsernameValid) { setUsernameStatus("idle"); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    setUsernameStatus("checking");
    debounceRef.current = window.setTimeout(async () => {
      const current = username;
      lastCheckedUsername.current = current;
      try {
        const res = await api.get("/auth/username-available", { params: { username: current } });
        if (lastCheckedUsername.current !== current) return;
        setUsernameStatus(res.data?.available ? "available" : "unavailable");
      } catch { 
        setUsernameStatus("idle"); 
      }
    }, USERNAME_DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username, isUsernameValid]);

  // 🚀 SUBMIT HANDLER (Robust Navigation Fix)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop Page Reload
    e.stopPropagation();

    if (!canSubmit) return;
    
    if (usernameStatus === "unavailable") {
      toast.error("Username is already taken");
      return;
    }

    setLoading(true);
    const fullEmail = `${emailLocal}@gmail.com`;
    const fullPhone = `${selectedCountry.dial}${phone}`;
    
    try {
      await api.post("/auth/signup", {
        name: `${firstName.trim()} ${lastName.trim()}`,
        username, 
        email: fullEmail, 
        phone: fullPhone,
      });
      
      toast.success("Identity Created.");
      // Force Navigation
      navigate("/verify-email", { 
        state: { email: fullEmail },
        replace: true 
      });
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Connection Failed");
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
        className="relative z-10 w-full max-w-[440px] bg-[#F4F4F5] dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
      >
        
        {/* ⚡ DEV BUTTON (Hidden in Production) */}
        {(import.meta as any).env.DEV && (
            <button 
                type="button"
                onClick={handleDevFill}
                className="absolute top-6 right-6 p-2 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 transition-colors z-50"
                title="Dev: Fill Random Identity"
            >
                <Zap className="w-4 h-4" />
            </button>
        )}

        {/* Toggle Pill */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-white dark:bg-[#1A1A1A] p-1 rounded-full flex relative shadow-sm border border-black/5 dark:border-white/5">
            <motion.div 
              layoutId="activePill"
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#E4E4E7] dark:bg-[#2A2A2A] rounded-full shadow-sm"
            />
            <button className="relative z-10 px-6 py-2 text-sm font-medium text-black dark:text-white transition-colors">
              Sign up
            </button>
            <Link to="/login">
              <button className="relative z-10 px-6 py-2 text-sm font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white tracking-tight relative z-10">
          Create an account
        </h2>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          <div className="grid grid-cols-2 gap-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 text-sm select-none">@</span>
            <input
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="username"
              className={`w-full bg-white dark:bg-[#1A1A1A] border ${usernameStatus === 'unavailable' ? 'border-red-500/30' : 'border-transparent'} focus:border-black/10 dark:focus:border-white/10 rounded-xl pl-8 pr-10 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {usernameStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-black/30 dark:text-white/30" />}
              {usernameStatus === "available" && <Check className="w-4 h-4 text-emerald-500" />}
              {usernameStatus === "unavailable" && <X className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="flex items-center bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden border border-transparent focus-within:border-black/10 dark:focus-within:border-white/10 transition-all shadow-sm">
            <input
              value={emailLocal}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="john.doe"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none"
            />
            <div className="px-4 py-3 bg-gray-50 dark:bg-[#222] text-black/40 dark:text-white/40 text-sm border-l border-gray-100 dark:border-white/5 select-none">
              @gmail.com
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className="h-full px-3 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl flex items-center gap-2 text-black dark:text-white border border-transparent shadow-sm transition-colors min-w-[80px] justify-between"
              >
                <span className="text-sm font-medium">{selectedCountry.dial}</span>
                <ChevronDown className={`w-3 h-3 text-black/40 dark:text-white/40 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full mb-2 left-0 w-[180px] bg-white dark:bg-[#222] border border-black/5 dark:border-white/5 rounded-xl shadow-xl py-1 z-50 overflow-hidden"
                  >
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                      >
                        <span className="text-black dark:text-white text-sm">{c.dial}</span>
                        <span className="text-black/40 dark:text-white/40 text-xs ml-auto">{c.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <input
              value={phone}
              onChange={(e) => { if (/^\d*$/.test(e.target.value)) setPhone(e.target.value); }}
              placeholder="Mobile Number"
              className="flex-1 bg-white dark:bg-[#1A1A1A] border border-transparent focus:border-black/10 dark:focus:border-white/10 rounded-xl px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 mt-6 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create an account"}
          </button>

          <p className="text-center text-[11px] text-black/30 dark:text-white/30 mt-4 px-4 leading-relaxed">
            By creating an account, you agree to our Terms & Service. <br/>
            Secure • Private • Encrypted
          </p>

        </form>
      </motion.div>
    </div>
  );
};