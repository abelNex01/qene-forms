import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DecryptedText from './ui/DecryptedText';

export function InitialLoader() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "INITIALIZING_KERNEL...",
    "LOADING_NEURAL_MODULES...",
    "ESTABLISHING_SECURE_UPLINK...",
    "BUILDING_UI_INTERFACE...",
    "ACCESS_GRANTED"
  ];

  useEffect(() => {
    setMounted(true);
    // Check if we've already shown the loader this session
    const hasLoaded = sessionStorage.getItem('qene-boot-v3');
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Start loading sequence
    const totalDuration = 2800; 
    const stepDuration = totalDuration / steps.length;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Slower, smoother progress
      });
    }, totalDuration / 100);

    // Step switching
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    // Completion
    const timeout = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('qene-boot-v3', 'true');
    }, totalDuration + 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="qene-boot-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden font-mono"
        >
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 scan-lines pointer-events-none opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

          <div className="w-full max-w-md px-6 relative z-10 flex flex-col gap-8">
              {/* Logo or System Name */}
              <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-3" />
                  <span className="text-xl tracking-[0.2em] font-bold text-foreground">
                      <DecryptedText text="QENE_SYSTEMS" animateOn="view" speed={80} maxIterations={12} />
                  </span>
              </div>

              {/* Terminal Window */}
              <div className="bg-card/50 border border-border/50 p-4 rounded-sm backdrop-blur-md min-h-[140px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col gap-2">
                       {steps.slice(0, currentStep + 1).map((step, index) => (
                          <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] sm:text-xs flex items-center gap-3"
                          >
                              <span className="text-muted-foreground opacity-50">[{index + 1}]</span>
                              <span className={index === steps.length - 1 ? "text-primary font-bold" : "text-muted-foreground"}>
                                  {index === currentStep ? (
                                      <DecryptedText text={step} animateOn="view" speed={40} maxIterations={6} />
                                  ) : step}
                              </span>
                              {index === currentStep && <span className="w-1.5 h-3 bg-primary animate-pulse" />}
                          </motion.div>
                       ))}
                  </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                  <div className="h-1 w-full bg-muted/20 overflow-hidden relative">
                      <motion.div 
                          className="h-full bg-primary shadow-[0_0_10px_var(--primary)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                      />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                      <span>status: initializing</span>
                      <span>{progress}%</span>
                  </div>
              </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
