import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FileJson, FileCode, Table, X, Terminal, Download, Code, Layers, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';

interface ExportModalProps {
    showExportModal: boolean;
    setShowExportModal: (show: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportCode: (options: any) => void;
    exportJSON: () => void;
    exportCSV: () => void;
    // Keep for backward compatibility if needed, but we'll use exportCode mostly
    exportHTML?: () => void;
}

export function ExportModal({
    showExportModal,
    setShowExportModal,
    exportCode,
    exportJSON,
    exportCSV
}: ExportModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<'frontend' | 'fullstack' | 'data'>('frontend');

    const frameworks = [
        { id: 'html-css', label: 'HTML + CSS', icon: FileCode, category: 'frontend', options: { framework: 'html', styling: 'css' } },
        { id: 'html-tw', label: 'HTML + Tailwind', icon: FileCode, category: 'frontend', options: { framework: 'html', styling: 'tailwind' } },
        { id: 'react-css', label: 'React + CSS', icon: Code, category: 'frontend', options: { framework: 'react', styling: 'css', language: 'js' } },
        { id: 'react-tw', label: 'React + Tailwind', icon: Code, category: 'frontend', options: { framework: 'react', styling: 'tailwind', language: 'js' } },
        { id: 'react-ts-tw', label: 'React (TS) + Tailwind', icon: Code, category: 'frontend', options: { framework: 'react', styling: 'tailwind', language: 'ts' } },
        { id: 'next-tw', label: 'Next.js + Tailwind', icon: Layers, category: 'fullstack', options: { framework: 'next', styling: 'tailwind', language: 'ts' } },
        { id: 'vue-tw', label: 'Vue + Tailwind', icon: Layers, category: 'frontend', options: { framework: 'vue', styling: 'tailwind' } },
        { id: 'svelte', label: 'Svelte', icon:  Layers, category: 'frontend', options: { framework: 'svelte', styling: 'css' } },
        { id: 'angular', label: 'Angular', icon: Layers, category: 'frontend', options: { framework: 'angular', styling: 'css' } },
        { id: 'php', label: 'PHP', icon: FileText, category: 'fullstack', options: { framework: 'php', styling: 'css' } },
    ];

  return (
    <Dialog open={showExportModal} onClose={() => setShowExportModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel as={motion.div} 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card border border-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-muted/30 border-b border-border px-3 sm:px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <Dialog.Title className="text-mono text-xs sm:text-sm font-bold text-foreground">
                  <DecryptedText text="EXPORT_MODULE_V2" animateOn="view" speed={50} maxIterations={10} />
                </Dialog.Title>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1.5 hover:text-foreground text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile: Category tabs at top */}
            <div className="flex md:hidden border-b border-border overflow-x-auto shrink-0">
              <button 
                onClick={() => setSelectedCategory('frontend')}
                className={`flex-1 px-3 py-2.5 text-[10px] font-mono whitespace-nowrap ${selectedCategory === 'frontend' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                FRONTEND
              </button>
              <button 
                onClick={() => setSelectedCategory('fullstack')}
                className={`flex-1 px-3 py-2.5 text-[10px] font-mono whitespace-nowrap ${selectedCategory === 'fullstack' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                FULLSTACK
              </button>
              <button 
                onClick={() => setSelectedCategory('data')}
                className={`flex-1 px-3 py-2.5 text-[10px] font-mono whitespace-nowrap ${selectedCategory === 'data' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                DATA
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Categories - Hidden on mobile */}
                <div className="hidden md:block w-44 lg:w-48 border-r border-border p-2 bg-muted/10 shrink-0">
                    <div className="space-y-1">
                        <button 
                            onClick={() => setSelectedCategory('frontend')}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded ${selectedCategory === 'frontend' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'}`}
                        >
                            FRONTEND_COMPONENTS
                        </button>
                        <button 
                            onClick={() => setSelectedCategory('fullstack')}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded ${selectedCategory === 'fullstack' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'}`}
                        >
                            FULLSTACK_Frameworks
                        </button>
                        <button 
                            onClick={() => setSelectedCategory('data')}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded ${selectedCategory === 'data' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'}`}
                        >
                            DATA_SCHEMAS
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            {selectedCategory === 'data' ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={exportJSON} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group rounded-lg">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 flex items-center justify-center rounded group-hover:bg-blue-500/20 shrink-0">
                                            <FileJson className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-mono text-sm font-bold text-foreground">JSON Schema</div>
                                            <div className="text-xs text-muted-foreground">Universal data format</div>
                                        </div>
                                        <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                    </button>
                                    <button onClick={exportCSV} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group rounded-lg">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/10 flex items-center justify-center rounded group-hover:bg-green-500/20 shrink-0">
                                            <Table className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-mono text-sm font-bold text-foreground">CSV Export</div>
                                            <div className="text-xs text-muted-foreground">Spreadsheet compatible</div>
                                        </div>
                                        <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    {frameworks.filter(f => f.category === selectedCategory).map((framework) => (
                                        <button
                                            key={framework.id}
                                            onClick={() => { exportCode(framework.options); setShowExportModal(false); }}
                                            className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group rounded-lg h-full"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="p-1.5 sm:p-2 bg-muted/30 rounded group-hover:bg-primary/10 transition-colors shrink-0">
                                                        <framework.icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-foreground">{framework.label}</span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono pl-1 hidden sm:block">
                                                // Generate {framework.options.framework} code
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/10 border-t border-border px-3 sm:px-4 py-2 sm:py-3 shrink-0 flex justify-between items-center text-mono text-[10px] text-muted-foreground">
                <span>GENERATOR_READY</span>
                <span>v2.4.5</span>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
  );
}
