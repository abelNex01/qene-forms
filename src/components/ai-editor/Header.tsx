import React from 'react';
import { Terminal, Undo, Redo, Eye, EyeOff, Download, Code, Cpu, Menu, Settings, X, Sparkles, PenTool } from 'lucide-react';
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
    isProcessing?: boolean;
    fieldsCount: number;
    onToggleLeftSidebar?: () => void;
    onToggleRightSidebar?: () => void;
    leftSidebarOpen?: boolean;
    rightSidebarOpen?: boolean;
    onOptimize?: () => void;
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
    isProcessing = false,
    fieldsCount,
    onToggleLeftSidebar,
    onToggleRightSidebar,
    leftSidebarOpen = false,
    rightSidebarOpen = false,
    onOptimize
}: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border z-50 h-16">

        <div className="absolute inset-0 scan-lines pointer-events-none opacity-50" />
        
        <div className="max-w-full mx-auto px-2 sm:px-4 h-full flex items-center justify-between relative">

          <a href="/" className="flex items-center select-none cursor-pointer">
                <img 
                  src="/qenelogo.svg" 
                  alt="Qene Forms Logo" 
                  className="h-8 w-auto max-w-none"
                 
                />
          </a>
          

          <div className="flex items-center gap-2 sm:gap-4">

            <div className="hidden md:flex items-center gap-2 mr-2 border-r border-border pr-4">
              <span className="text-[10px] font-mono text-muted-foreground">FORM_TITLE:</span>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Untitled Form"
                className="bg-transparent border-none focus:ring-0 text-sm font-mono text-primary w-40 lg:w-64 placeholder:text-muted-foreground/30"
              />
            </div>


            <button
               onClick={onOptimize}
               disabled={!hasFields || isProcessing}
               className={`hidden sm:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border transition-all mr-1 ${
                 hasFields && !isProcessing
                   ? 'border-purple-500/50 hover:bg-purple-500/10 text-purple-400'
                   : 'border-transparent text-muted-foreground opacity-50 cursor-not-allowed'
               }`}
               title="AI Optimize"
             >
               <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
               <span className="text-mono text-xs hidden lg:inline">OPTIMIZE</span>
             </button>


            <div className="flex items-center border border-border bg-muted/20">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 sm:p-2 hover:bg-muted disabled:opacity-40 transition-colors border-r border-border"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= historyLength - 1}
                className="p-1.5 sm:p-2 hover:bg-muted disabled:opacity-40 transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="hidden sm:block h-6 w-px bg-border mx-1" />
            

            <button
              onClick={() => setPreviewMode(!previewMode)}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border transition-all ${
                !hasFields 
                  ? 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
                  : previewMode 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-border hover:border-muted-foreground bg-muted/20'
              }`}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-mono text-xs hidden sm:inline">
                {previewMode ? 'EXIT' : 'PREVIEW'}
              </span>
            </button>
            

            <button
              onClick={() => setShowCode(!showCode)}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border transition-all ${
                !hasFields 
                  ? 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
                  : showCode 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-border hover:border-muted-foreground bg-muted/20'
              }`}
            >
              <Code className="w-4 h-4" />
              <span className="text-mono text-xs hidden sm:inline">
                {showCode ? 'EXIT' : 'CODE'}
              </span>
            </button>


            <motion.button
              whileHover={hasFields ? { scale: 1.02 } : {}}
              whileTap={hasFields ? { scale: 0.98 } : {}}
              onClick={onExport}
              disabled={!hasFields}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border transition-all ${
                hasFields 
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 cursor-pointer shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                  : 'bg-muted/20 border-border text-muted-foreground cursor-not-allowed grayscale'
              }`}
            >
              <Download className={`w-4 h-4 ${hasFields ? 'animate-pulse' : ''}`} />
              <span className="text-mono text-xs font-bold hidden sm:inline">
                <DecryptedText text="EXPORT" animateOn={hasFields ? "hover" : "view"} speed={40} maxIterations={8} />
              </span>
            </motion.button>
            

            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden p-2 hover:bg-muted border border-border transition-colors ml-1"
              aria-label="Toggle field inspector"
            >
              {rightSidebarOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Settings className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>
  );
}
