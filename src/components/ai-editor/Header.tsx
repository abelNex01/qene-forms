import React from 'react';
import { Undo, Redo, Eye, EyeOff, Download, Code, Menu, Settings, X } from 'lucide-react';
import { motion } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';

interface HeaderProps {
    formTitle: string;
    setFormTitle: (title: string) => void;
    undo: () => void;
    redo: () => void;
    historyIndex: number;
    historyLength: number;
    previewMode: boolean;
    setPreviewMode: (mode: boolean) => void;
    showCode: boolean;
    setShowCode: (show: boolean) => void;
    onExport: () => void;
    hasFields?: boolean;
    fieldsCount: number;
    onToggleLeftSidebar?: () => void;
    onToggleRightSidebar?: () => void;
    leftSidebarOpen?: boolean;
    rightSidebarOpen?: boolean;
}

export function Header({
    formTitle,
    setFormTitle,
    undo,
    redo,
    historyIndex,
    historyLength,
    previewMode,
    setPreviewMode,
    showCode,
    setShowCode,
    onExport,
    hasFields = false,
    fieldsCount,
    onToggleLeftSidebar,
    onToggleRightSidebar,
    leftSidebarOpen = false,
    rightSidebarOpen = false,
}: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border z-50 h-14 sm:h-16">

        <div className="absolute inset-0 scan-lines pointer-events-none opacity-50" />
        
        <div className="max-w-full mx-auto px-2 sm:px-4 h-full flex items-center justify-between relative overflow-hidden">

          {/* Left Section: Mobile Menu + Logo + Title */}
          <div className="flex items-center gap-1 sm:gap-4 min-w-0 shrink">
              {/* Left sidebar toggle - visible only on mobile/tablet */}
              <button
                onClick={onToggleLeftSidebar}
                className="lg:hidden p-1.5 hover:bg-muted border border-border transition-colors mr-1 shrink-0"
                aria-label="Toggle field types sidebar"
              >
                {leftSidebarOpen ? (
                  <X className="w-4 h-4 text-primary" />
                ) : (
                  <Menu className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <a href="/" className="flex items-center select-none cursor-pointer shrink-0">
                    <img 
                      src="/qenelogo.svg" 
                      alt="Qene Forms Logo" 
                      className="h-6 sm:h-8 w-auto max-w-none"
                    />
              </a>
              
              <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-border pr-4 shrink min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap hidden md:inline">FORM_TITLE:</span>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Untitled Form"
                    className="bg-transparent border-none focus:ring-0 text-sm font-mono text-primary w-24 md:w-40 lg:w-64 placeholder:text-muted-foreground/30 truncate"
                  />
              </div>
          </div>

          {/* Right Section: Actions + Right Sidebar Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            <div className="hidden sm:flex items-center border border-border bg-muted/20">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 sm:p-2 hover:bg-muted disabled:opacity-40 transition-colors border-r border-border"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= historyLength - 1}
                className="p-1.5 sm:p-2 hover:bg-muted disabled:opacity-40 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="hidden sm:block h-6 w-px bg-border mx-1" />
            

            <button
              onClick={() => setPreviewMode(!previewMode)}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 border transition-all ${
                !hasFields 
                  ? 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
                  : previewMode 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-border hover:border-muted-foreground bg-muted/20'
              }`}
            >
              {previewMode ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="text-mono text-xs hidden lg:inline">
                {previewMode ? 'EXIT' : 'PREVIEW'}
              </span>
            </button>
            

            <button
              onClick={() => setShowCode(!showCode)}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 border transition-all ${
                !hasFields 
                  ? 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
                  : showCode 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-border hover:border-muted-foreground bg-muted/20'
              }`}
            >
              <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-mono text-xs hidden lg:inline">
                {showCode ? 'EXIT' : 'CODE'}
              </span>
            </button>


            <motion.button
              whileHover={hasFields ? { scale: 1.02 } : {}}
              whileTap={hasFields ? { scale: 0.98 } : {}}
              onClick={onExport}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-1.5 sm:py-2 border transition-all ${
                hasFields 
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 cursor-pointer shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                  : 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
              }`}
            >
              <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${hasFields ? 'animate-pulse' : ''}`} />
              <span className="text-mono text-xs font-bold hidden lg:inline">
                <DecryptedText text="EXPORT" animateOn={hasFields ? "hover" : "view"} speed={40} maxIterations={8} />
              </span>
            </motion.button>
            

            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden p-1.5 hover:bg-muted border border-border transition-colors ml-1"
              aria-label="Toggle field inspector"
            >
              {rightSidebarOpen ? (
                <X className="w-4 h-4 text-primary" />
              ) : (
                <Settings className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>
  );
}
