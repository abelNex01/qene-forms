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
  Heart,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";
import { useLocation } from "wouter";
import Donation from "./Donation";
import { TerminalModal } from "@/components/ui/TerminalModal";
import { Input } from "@/components/ui/input";

const SourceCodeRequestForm = ({ onComplete }: { onComplete: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Logic for actual submission could go here
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center py-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
        <h3 className="text-xl font-bold text-primary font-mono uppercase tracking-widest">Request Transmitted</h3>
        <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
          Your identifier has been logged. Our development team has been notified of your interest in the source code.
        </p>
        <div className="bg-black/40 border border-white/5 p-4 rounded-sm inline-block">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">
            Status: <span className="text-primary">PENDING_REVIEW</span>
          </p>
          <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
             Action: PLEASE_WAIT_FOR_CONTACT
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground italic pt-4">
          The developers will reach out to you directly via your provided identifier.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-sm">
        <p className="text-primary text-xs font-mono mb-2">ACCESS_LEVEL: RESTRICTED</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          To request the full source code for Qene Forms, please submit your contact information below.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted-foreground uppercase">IDENTIFIER (EMAIL)</label>
          <Input required type="email" placeholder="USER@ORG.DOMAIN" className="bg-black/40 border-white/10 font-mono text-xs rounded-none h-10" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-muted-foreground uppercase">PURPOSE_OF_REQUEST</label>
          <textarea 
            required
            className="w-full bg-black/40 border border-white/10 font-mono text-xs rounded-none p-3 h-24 focus:ring-1 focus:ring-primary focus:outline-none text-gray-300"
            placeholder="Describe your intent..."
          />
        </div>
        <Button type="submit" className="w-full bg-primary text-black font-mono font-bold tracking-widest rounded-none h-12 hover:bg-primary/90">
          INITIALIZE_REQUEST
        </Button>
      </div>
    </form>
  );
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeData, setActiveData] = useState({ title: "", content: <></> });

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

  const handleGitHubClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveData({
      title: "System Request: Source Code",
      content: <SourceCodeRequestForm onComplete={() => setTerminalOpen(false)} />
    });
    setTerminalOpen(true);
  };

  return (
    <>
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 scale-90 origin-top">
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
            <div className="hidden md:flex items-center border-l border-border pl-4 gap-4">
              <a 
                href="#" 
                onClick={handleGitHubClick}
                className="text-muted-foreground hover:text-primary transition-colors p-2"
              >
                <Github className="w-5 h-5" />
              </a>
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
                    <a 
                        href="#"
                        onClick={handleGitHubClick}
                        className="text-2xl font-mono font-bold text-foreground border-b border-border pb-4 flex items-center justify-center gap-2"
                    >
                        <Github className="w-6 h-6" />
                        GITHUB
                    </a>
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
    
    <TerminalModal 
      isOpen={terminalOpen}
      onClose={() => setTerminalOpen(false)}
      title={activeData.title}
      content={activeData.content}
    />
    </>
  );
}
