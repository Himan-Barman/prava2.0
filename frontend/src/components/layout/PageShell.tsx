import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react';

export const PageShell = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <ReactLenis root>
      {/* 🟢 GLOBAL LAYOUT CONTROLLER 
          - bg-white / dark:bg-black : Ensures base layer is correct
          - pl-20 : Pushes content right to respect the Sidebar
          - pt-16 : Pushes content down to respect the Navbar
          - min-h-screen : Ensures full height
      */}
      <main className={`
        min-h-screen w-full 
        pl-20 pt-16 
        bg-[#FAFAFA] dark:bg-[#050505] 
        transition-colors duration-300 ease-in-out
        ${className}
      `}>
        {children}
      </main>
    </ReactLenis>
  );
};