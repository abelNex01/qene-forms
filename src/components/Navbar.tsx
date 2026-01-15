import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, 
  Menu, 
  X, 
  Monitor,
  Layout,
  FileCode,
  Box,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";
import { useLocation } from "wouter";
import Donation from "./Donation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeLink, setActiveLink] = useState("");

  // App-specific navigation links
  const navLinks = [
    { label: "INSTALL", icon: FileCode, href: "/#installation" },
    { label: "FEATURES", icon: PenTool, href: "/#features" },
    { label: "ECOSYSTEM", icon: Box, href: "/#integrations" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Extract target ID from href (e.g., "/#features" -> "#features")
    const targetId = href.includes("#") ? href.split("#")[1] : "";
    const selector = targetId ? `#${targetId}` : "";

    if (location === "/" || location === "") {
        // If already on home, scroll smoothly
        if (selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                setActiveLink(href);
            }
        } else if (href === "/" || href === "/#hero") {
             window.scrollTo({ top: 0, behavior: "smooth" });
             setActiveLink("");
        }
    } else {
        // If on another page, navigate to home with hash
        setLocation(href);
        setActiveLink(href);
    }
  };

  return (
    <>
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div 
        className="pointer-events-auto flex items-center justify-between gap-8 bg-card/90 backdrop-blur-xl border border-border px-4 py-2 neo-border w-full max-w-2xl"
      >
          {/* Logo Section */}
          <a href="/#hero" onClick={(e) => handleScroll(e, "/#hero")} className="flex items-center gap-3 select-none cursor-pointer">
          
                <img src="/favicon.png" alt="Qene Forms Logo" className="w-8 h-8 object-contain" />
          

          </a>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
             {/* Support the Project Button (Desktop) */}
            <div className="hidden md:flex items-center border-l border-border pl-4">
             <Button
  onClick={() => setIsDonationOpen(true)}
  className="
    relative overflow-hidden
    font-mono text-xs font-bold tracking-widest
    bg-[#C2E812] text-black
    border border-lime-300/40
    px-4 py-2
    gap-2
    shadow-[0_0_12px_rgba(194,232,18,0.6)]
    hover:shadow-[0_0_20px_rgba(194,232,18,0.9)]
    hover:bg-lime-400
    transition-all duration-300
    before:absolute before:inset-0
    before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)]
    before:translate-x-[-100%]
    hover:before:translate-x-[100%]
    before:transition-transform before:duration-700
  "
>
  <Heart className="w-3 h-3 fill-black" />
  SUPPORT_US
</Button>


            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="hover:bg-transparent hover:text-primary"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>
          </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 top-0 z-40 bg-background/95 backdrop-blur-xl pt-32 px-6 pb-6 md:hidden flex flex-col items-center text-center space-y-8"
            >
                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <a 
                        onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            handleScroll(e, "/#hero");
                        }} 
                        href="/#hero" 
                        className="text-2xl font-mono font-bold text-foreground border-b border-border pb-4"
                    >
                        HOME
                    </a>
                    <button 
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsDonationOpen(true);
                        }} 
                        className="text-2xl font-mono font-bold text-primary border-b border-border pb-4 flex items-center justify-center gap-2"
                    >
                        <Heart className="w-6 h-6 fill-primary" />
                        SUPPORT THE PROJECT
                    </button>
                </div>

                <div className="mt-auto flex flex-col items-center gap-6 pt-12">
                     <div className="flex flex-col items-center gap-2 text-muted-foreground">
                         <Monitor className="w-6 h-6" />
                         <span className="text-[10px] font-mono">STABLE RELEASE</span>
                     </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>

    <Donation isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </>
  );
}
