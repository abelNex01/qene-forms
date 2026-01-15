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
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";
import { useLocation } from "wouter";

// Simple NPM Icon Component
const NpmIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 780 250" className={className} fill="currentColor" aria-hidden="true">
    <path d="M240,250h100v-50h100v0v50h100v0v-150h-100v0v50h-100v0v-50h-100v0z M0,250h240v-250h-240v0z M540,250h240v-250h-240v0z M640,200v0v-150h50v0v150z" />
  </svg>
);

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        className="pointer-events-auto flex items-center justify-between gap-8 bg-card/90 backdrop-blur-xl border border-border px-8 py-2 neo-border w-full max-w-2xl"
      >
          {/* Logo Section */}
          <a href="/#hero" onClick={(e) => handleScroll(e, "/#hero")} className="flex items-center gap-3 select-none cursor-pointer">
             <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground">
                <PenTool className="w-4 h-4" />
             </div>
             <span className="text-sm font-bold tracking-tight text-foreground font-mono leading-none hidden sm:block">
               <DecryptedText text="AI_FORM_BUILDER" animateOn="view" speed={50} maxIterations={10} />
             </span>
          </a>

          {/* Center: GitHub & NPM Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                aria-label="NPM"
              >
                <NpmIcon className="w-8 h-4" /> 
              </a>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
             {/* Launch Studio Button (Desktop) */}
            <div className="hidden md:flex items-center border-l border-border pl-4">
               <Button 
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                  className="font-mono text-xs font-bold border-primary/50 text-primary hover:bg-primary/10 transition-all"
               >
                  LAUNCH_STUDIO
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
                            setLocation("/dashboard");
                        }} 
                        className="text-2xl font-mono font-bold text-primary border-b border-border pb-4"
                    >
                        LAUNCH STUDIO
                    </button>
                </div>

                <div className="mt-auto flex flex-col items-center gap-6 pt-12">
                     <div className="flex gap-6">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <Github className="w-6 h-6" />
                          <span className="text-[10px] font-mono">GITHUB</span>
                        </a>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                          <NpmIcon className="w-12 h-6" />
                          <span className="text-[10px] font-mono">NPM</span>
                        </a>
                     </div>
                     <div className="flex flex-col items-center gap-2 text-muted-foreground">
                         <Monitor className="w-6 h-6" />
                         <span className="text-[10px] font-mono">STABLE RELEASE</span>
                     </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
}
