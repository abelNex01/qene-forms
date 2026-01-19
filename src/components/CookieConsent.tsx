import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import DecryptedText from './ui/DecryptedText';
import { Button } from './ui/button';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('qene-privacy-v6');
    if (!consent) {
       // Wait for boot loader (2.8s + transition ~ 4s total)
       const timer = setTimeout(() => setIsVisible(true), 4500);
       return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('qene-privacy-v6', 'accepted');
    setIsAccepted(true);
    setTimeout(() => setIsVisible(false), 2000);
  };

  const handleDecline = () => {
    localStorage.setItem('qene-privacy-v6', 'declined');
    setIsVisible(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           key="cookie-consent-overlay"
           initial={{ opacity: 0, y: 50, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
           transition={{ duration: 0.4, ease: "circOut" }}
           className="fixed bottom-4 right-4 z-[95] max-w-sm w-[calc(100%-2rem)]"
        >
            <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 p-5 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.6)] neo-border overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none transition-colors duration-500 ${isAccepted ? 'bg-green-500/20' : ''}`} />
                
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {!isAccepted ? (
                            <motion.div 
                                key="consent-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-primary/10 rounded-sm border border-primary/20">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="font-mono text-sm font-bold tracking-wider text-foreground">
                                        <DecryptedText text="PRIVACY_PROTOCOL" animateOn="view" speed={80} maxIterations={10} />
                                    </h3>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed mb-5 font-mono">
                                    System requires local storage access to optimize neural network coherence and maintain session state continuity.
                                </p>

                                <div className="flex gap-2">
                                    <Button 
                                        onClick={handleAccept}
                                        className="flex-1 bg-primary text-background hover:bg-primary/90 rounded-sm h-8 text-xs font-bold font-mono tracking-wide"
                                    >
                                        <span className="mr-2">ACCESS_GRANTED</span>
                                        <span className="text-[10px] opacity-60">// ACCEPT</span>
                                    </Button>
                                    <Button 
                                        onClick={handleDecline}
                                        variant="outline"
                                        className="flex-1 bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5 rounded-sm h-8 text-xs font-mono"
                                    >
                                        DENY
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success-msg"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="py-4 flex flex-col items-center justify-center text-center space-y-3"
                            >
                                <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-green-500 font-mono font-bold text-sm tracking-[0.2em]">
                                        <DecryptedText text="CONNECTION_ESTABLISHED" animateOn="view" speed={50} />
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                                        Neural Link Active // Syncing
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary/50" />
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
