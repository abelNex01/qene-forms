import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, Terminal } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import DecryptedText from "@/components/ui/DecryptedText";

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      {/* Glitch/Scanline Effect Overlay */}
      <div className="absolute inset-0 scan-lines opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center p-6 max-w-2xl"
      >
        {/* Animated Icon */}
        <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 relative"
        >
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="w-24 h-24 bg-card border border-border flex items-center justify-center rounded-2xl relative neo-border">
                <FileQuestion className="w-10 h-10 text-primary animate-pulse" />
                
                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary" />
            </div>
        </motion.div>

        {/* Main Error Code */}
        <h1 className="text-display font-bold text-foreground leading-none mb-2">
            <DecryptedText text="404" animateOn="view" speed={100} maxIterations={20} />
        </h1>

        {/* Status Label */}
        <div className="flex items-center gap-2 mb-6 px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-mono text-destructive tracking-widest uppercase">
                <DecryptedText text="MODULE_NOT_FOUND" animateOn="view" speed={60} maxIterations={10} />
            </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-lg mb-12 max-w-md leading-relaxed">
            <DecryptedText 
                text="The requested signal path could not be established. The resource may have been moved, deleted, or never existed in this timeline."
                animateOn="view"
                speed={30}
                maxIterations={5}
            />
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
             <MagneticButton
                onClick={() => setLocation("/")}
                variant="default"
                size="lg"
                className="gap-3 min-w-[200px]"
             >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-mono font-bold">RETURN_HOME</span>
             </MagneticButton>

             <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
             >
                 <button 
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors group"
                 >
                    <Terminal className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span className="group-hover:underline decoration-primary/50 underline-offset-4">system.back()</span>
                 </button>
             </motion.div>
        </div>

        {/* Technical Footer */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-24 font-mono text-[10px] text-muted-foreground/50"
        >
            ERROR_CODE: 0x404_NOT_FOUND | KERNEL_PANIC | QENE_FORMS_V2.4.0
        </motion.div>
      </motion.div>
    </div>
  );
}
