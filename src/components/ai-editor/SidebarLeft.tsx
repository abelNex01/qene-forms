import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';
import { FIELD_TYPES } from './constants';

interface SidebarLeftProps {
    addField: (type: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
    isCollapsible?: boolean;
}

export function SidebarLeft({
    addField,
    isOpen = false,
    onClose,
    isCollapsible = false,
}: SidebarLeftProps) {
  const sidebarContent = (
    <>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />
      
      {/* Mobile/Tablet close button */}
      {isCollapsible && (
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-3 z-10 flex items-center justify-between lg:hidden">
          <span className="text-mono text-xs text-primary font-bold">ADD_FIELD</span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted border border-transparent hover:border-border transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
      
      {/* Field Types Section */}
      <div className="p-3 sm:p-4 relative">
        {/* Section header with code comment styling - hidden on collapsible since we have header */}
        <div className={`mb-4 ${isCollapsible ? 'hidden' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <ChevronRight className="w-3 h-3 text-primary" />
            <span className="text-mono text-[11px] text-primary font-bold">
              <DecryptedText text="ADD_FIELD" animateOn="view" speed={60} maxIterations={8} />
            </span>
          </div>
          <div className="text-mono text-[10px] text-muted-foreground pl-5">
            /* Drag or click to add */
          </div>
        </div>
        
        {/* Field type list with line numbers */}
        <div className="space-y-0.5">
          {FIELD_TYPES.map(({ type, label, icon: Icon }, index) => (
            <button
              key={type}
              onClick={() => {
                addField(type);
                // Auto-close sidebar on mobile/tablet after selection
                if (isCollapsible && onClose) {
                  onClose();
                }
              }}
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', type);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              type="button"
              className="w-full flex items-center gap-2 sm:gap-3 px-2 py-2.5 sm:py-2 text-left hover:bg-muted/50 transition-all group border-l-2 border-transparent hover:border-primary hover:translate-x-1 active:scale-95 cursor-grab active:cursor-grabbing"
            >
              {/* Line number */}
              <span className="text-mono text-[10px] text-muted-foreground w-4 text-right opacity-50 group-hover:opacity-100">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Icon with accent background on hover */}
              <div className="w-7 h-7 sm:w-7 sm:h-7 flex items-center justify-center bg-muted/50 group-hover:bg-primary/20 transition-colors shrink-0 pointer-events-none">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              {/* Label styled like code */}
              <span className="text-mono text-xs text-foreground group-hover:text-primary transition-colors truncate pointer-events-none">
                {label.replace(/\s/g, '_')}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 mt-auto">
        <div className="flex items-center justify-between text-mono text-[10px] text-muted-foreground">
          <span>READY</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success" />
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile/Tablet: Slide-in overlay
  if (isCollapsible) {
    return (
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed left-0 top-16 bottom-0 w-72 max-w-[85vw] bg-card border-r border-border overflow-y-auto z-50"
      >
        {sidebarContent}
      </motion.div>
    );
  }

  // Desktop: Inline sidebar (1024px+)
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-48 lg:w-64 xl:w-72 bg-card border-r border-border overflow-y-auto relative shrink-0 hidden lg:block"
    >
      {sidebarContent}
    </motion.div>
  );
}
