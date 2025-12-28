import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/entities/session/model/store";
import { useEffect } from "react";
import React from "react";

// 📄 Page Imports - Auth & Public
import { Landing } from "@/pages/public/Landing";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { VerifyEmail } from "@/pages/auth/VerifyEmail";
import { SetPassword } from "@/pages/auth/SetPassword";


// 📄 Page Imports - Protected App
import { Feed } from "@/pages/feed/Feed"; 
import { Chat } from "@/pages/chat/Chat";
import { Explore } from "@/pages/explore/Explore";
import { Friends } from "@/pages/social/Friends";
import { Groups } from "@/pages/social/Groups";
import { Notifications } from "@/pages/notifications/Notifications";
import { Settings } from "@/pages/settings/Settings";
import { Profile } from "@/pages/profile/Profile";

// 🏗️ Layout Import
import { DashboardLayout } from "@/widgets/layout/DashboardLayout";

// 🚧 Loading Screen
const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium tracking-widest opacity-50 uppercase">Securing Session</p>
    </div>
  </div>
);

// 🛡️ Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // 🛑 KEY FIX: Only check with backend if we aren't logged in yet.
    // This allows the "Dev Bypass" to work because we are already "authenticated" in memory.
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  // If loading is stuck (rare edge case), we can force render if authenticated
  if (isLoading && !isAuthenticated) return <LoadingScreen />;
  
  // If not logged in, kick out
  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🟢 PUBLIC LANDING */}
        <Route path="/" element={<Landing />} />

        {/* 🟢 AUTHENTICATION FLOW */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/set-password" element={<SetPassword />} />
        </Route>

        {/* 🟢 PROTECTED APP (With Dashboard Layout) */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 🏠 Main Feed */}
          <Route path="/feed" element={<Feed />} />
          
          {/* 💬 Communication */}
          <Route path="/chat" element={<Chat />} />
          
          {/* 🌍 Discovery */}
          <Route path="/explore" element={<Explore />} />
          
          {/* 👥 Social */}
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          
          {/* 🔔 Utilities */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          {/* 👤 Profile - NOW ACTIVE */}
          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* 🟢 404 FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};