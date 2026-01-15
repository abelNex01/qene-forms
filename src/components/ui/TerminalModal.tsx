
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export function TerminalModal({ isOpen, onClose, title, content }: TerminalModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isMaximized ? "100%" : "min(800px, 100%)",
              height: isMaximized ? "100%" : "min(600px, 80vh)",
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "relative flex flex-col neo-border bg-card overflow-hidden shadow-2xl transition-all duration-300",
              isMaximized ? "rounded-none h-full w-full inset-0 m-0" : "max-h-[80vh] w-full max-w-3xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div 
                className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 select-none"
                onDoubleClick={() => setIsMaximized(!isMaximized)}
            >
              <div className="flex items-center gap-4">
                {/* Traffic Lights */}
                <div className="flex items-center gap-2">
                  <div 
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors shadow-sm" 
                  />
                  <div 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors shadow-sm" 
                  />
                  <div 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors shadow-sm" 
                  />
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground ml-2">
                  <Terminal className="w-3 h-3" />
                  <span className="opacity-50">user@admin:~/</span>
                  <span className="text-foreground font-bold">{title.replace(/\s+/g, '_').toLowerCase()}</span>
                </div>
              </div>

               {/* Window Controls (Alternative) */}
               <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                 <button onClick={() => setIsMaximized(!isMaximized)} className="p-1 hover:bg-white/10 rounded">
                    {isMaximized ? <Minus className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                 </button>
                 <button onClick={onClose} className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded">
                    <X className="w-3 h-3" />
                 </button>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-black/90 text-green-400 font-mono text-sm relative overflow-hidden">
                <ScrollArea className="h-full w-full">
                    <div className="p-6 space-y-4">
                         {/* Command Log Effect */}
                        <div className="text-muted-foreground opacity-50 mb-6">
                            <p suppressHydrationWarning>{`> Last login: ${new Date().toUTCString()} on ttys001`}</p>
                            <p>{`> Opening stream to: ${title}`}</p>
                            <p>{`> Fetching packets... DONE`}</p>
                            <p>----------------------------------------</p>
                        </div>

                        {/* Main Content */}
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                             {content}
                        </div>
                        
                        {/* Blinking Cursor */}
                        <div className="mt-8 flex items-center gap-2 text-primary animate-pulse">
                            <span>_</span>
                        </div>
                    </div>
                </ScrollArea>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
