import { motion } from "framer-motion";
import { 
  User, Shield, Bell, Moon, LogOut, ChevronRight, Smartphone, 
  Lock, Eye, Globe, HelpCircle, HardDrive, Zap, Sun, Monitor,
  Check
} from "lucide-react";
import { useAuthStore } from "@/entities/session/model/store";
import { useThemeStore } from "@/entities/theme/store";

export const Settings = () => {
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useThemeStore();

  return (
    // 🟢 FIX: Dynamic Background (White in Light Mode, Black in Dark Mode)
    <div className="w-full max-w-3xl mx-auto pb-20 pt-8 px-6 font-sans transition-colors duration-300 min-h-screen
      bg-[#F2F2F7] dark:bg-[#0c0c0c] 
      text-[#1c1c1e] dark:text-[#e5e5e5]"
    >
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your experience and privacy.</p>
      </motion.div>

      <div className="space-y-8">
        
        {/* APPEARANCE */}
        <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 px-2">Appearance</h3>
            <div className="grid grid-cols-3 gap-4">
                <ThemeCard 
                    active={theme === 'light'} 
                    onClick={() => setTheme('light')}
                    icon={Sun} 
                    label="Light" 
                    previewColor="bg-[#F4F4F5]"
                />
                <ThemeCard 
                    active={theme === 'dark'} 
                    onClick={() => setTheme('dark')}
                    icon={Moon} 
                    label="Dark" 
                    previewColor="bg-[#1A1A1A]"
                />
                <ThemeCard 
                    active={theme === 'system'} 
                    onClick={() => setTheme('system')}
                    icon={Monitor} 
                    label="Auto" 
                    previewColor="bg-gradient-to-br from-[#F4F4F5] to-[#1A1A1A]"
                />
            </div>
        </section>

        {/* PRIVACY */}
        <SettingsGroup title="Privacy & Security">
          <SettingsItem 
            icon={Lock} 
            label="Two-Factor Authentication" 
            status="Enabled" 
            color="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10" 
          />
          <SettingsItem 
            icon={Eye} 
            label="Active Status" 
            description="Show when you're active"
            toggle 
          />
          <SettingsItem 
            icon={Smartphone} 
            label="Sessions" 
            status="3 Active" 
          />
           <SettingsItem 
            icon={Shield} 
            label="Identity Verification" 
            status="Verified"
            color="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10"
          />
        </SettingsGroup>

        {/* PREFERENCES */}
        <SettingsGroup title="App Preferences">
          <SettingsItem icon={Bell} label="Push Notifications" toggle defaultChecked />
          <SettingsItem icon={Globe} label="Language" status="English (US)" />
          <SettingsItem icon={HardDrive} label="Storage & Data" />
          <SettingsItem icon={Zap} label="Reduce Motion" toggle />
        </SettingsGroup>

        {/* SUPPORT */}
        <SettingsGroup title="Support">
          <SettingsItem icon={HelpCircle} label="Help Center" />
          <SettingsItem icon={User} label="Account Data" />
        </SettingsGroup>

        {/* DANGER ZONE */}
        <motion.button 
          onClick={logout}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full p-4 rounded-2xl flex items-center justify-between group shadow-sm hover:shadow-md transition-all
            bg-white dark:bg-[#111] 
            border border-red-200 dark:border-red-900/30"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500">
                <LogOut className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-red-600 dark:text-red-500">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </motion.button>

        <div className="text-center pt-8 pb-4">
            <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
                Prava for Web v1.0.4 (Rolls Royce Build)
            </p>
        </div>

      </div>
    </div>
  );
};

/* -------------------------------------------------------
   💎 Sub-Components (Theme Aware)
------------------------------------------------------- */

const ThemeCard = ({ active, onClick, icon: Icon, label, previewColor }: any) => (
    <button 
        onClick={onClick}
        className={`
            relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300
            ${active 
                ? "bg-white dark:bg-[#1d1d1d] border-black/10 dark:border-white/20 shadow-xl scale-[1.02]" 
                : "bg-transparent border-black/5 dark:border-[#333] hover:bg-black/5 dark:hover:bg-[#111]"
            }
        `}
    >
        {/* Fake UI Preview */}
        <div className={`w-full h-12 rounded-lg ${previewColor} shadow-inner mb-1 flex items-center justify-center opacity-80 border border-black/5`}>
             <Icon className={`w-5 h-5 ${active ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"}`} />
        </div>
        <span className={`text-xs font-bold ${active ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
            {label}
        </span>
        {active && (
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#b984f8] flex items-center justify-center">
               <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
        )}
    </button>
);

const SettingsGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    // 🟢 FIX: Card Backgrounds flip White/Black
    className="rounded-3xl overflow-hidden shadow-sm
      bg-white dark:bg-[#111] 
      border border-gray-200 dark:border-[#222]"
  >
    <div className="px-6 py-3 border-b text-[11px] font-bold uppercase tracking-wider
      bg-gray-50 dark:bg-[#1a1a1a] 
      border-gray-100 dark:border-[#222] 
      text-gray-400 dark:text-gray-500"
    >
      {title}
    </div>
    <div className="divide-y divide-gray-100 dark:divide-[#222]">
      {children}
    </div>
  </motion.div>
);

const SettingsItem = ({ icon: Icon, label, status, description, color, toggle, defaultChecked }: any) => (
  <div className="flex items-center justify-between p-4 pl-6 transition-colors cursor-pointer group min-h-[72px]
    hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
  >
    <div className="flex items-center gap-5">
      <div className={`
        p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110
        ${color ? color : "bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-white"} 
      `}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <span className="font-bold text-sm text-gray-900 dark:text-white block">{label}</span>
        {description && <span className="text-xs text-gray-500 font-medium">{description}</span>}
      </div>
    </div>

    <div className="flex items-center gap-4">
      {status && (
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            {status}
        </span>
      )}
      
      {toggle ? (
        <div className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
           {/* Toggle Switch Colors */}
           <div className="w-11 h-6 peer-focus:outline-none rounded-full peer 
             bg-gray-200 dark:bg-[#333] 
             peer-checked:bg-[#b984f8]
             peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
           ></div>
        </div>
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
      )}
    </div>
  </div>
);