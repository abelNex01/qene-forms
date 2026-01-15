import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Minus, Square, Terminal, Code, Copy, Check, Maximize2, Monitor, FileCode, Layers, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeGenerator } from './codeGenerator';
import DecryptedText from '@/components/ui/DecryptedText';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formTitle: string;
    formDescription: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[];
}

export function CodeModal({
    isOpen,
    onClose,
    formTitle,
    formDescription,
    fields
}: CodeModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState({
        id: 'react-tw',
        label: 'React + Tailwind',
        framework: 'react',
        styling: 'tailwind',
        language: 'ts'
    });
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    const frameworks = [
        { id: 'html-css', label: 'HTML + CSS', framework: 'html', styling: 'css' },
        { id: 'html-tw', label: 'HTML + Tailwind', framework: 'html', styling: 'tailwind' },
        { id: 'react-css', label: 'React + CSS', framework: 'react', styling: 'css', language: 'js' },
        { id: 'react-tw', label: 'React + Tailwind', framework: 'react', styling: 'tailwind', language: 'ts' },
        { id: 'next-tw', label: 'Next.js + Tailwind', framework: 'next', styling: 'tailwind', language: 'ts' },
        { id: 'vue-tw', label: 'Vue + Tailwind', framework: 'vue', styling: 'tailwind' },
        { id: 'svelte', label: 'Svelte', framework: 'svelte', styling: 'css' },
        { id: 'php', label: 'PHP', framework: 'php', styling: 'css' },
    ];

    useEffect(() => {
        if (isOpen) {
            const generator = new CodeGenerator(fields, formTitle, formDescription);
            const code = generator.generate({
                framework: selectedFramework.framework,
                styling: selectedFramework.styling,
                language: selectedFramework.language
            });
            setGeneratedCode(code);
        }
    }, [isOpen, fields, formTitle, formDescription, selectedFramework]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
                aria-hidden="true" 
            />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel 
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`bg-[#1a1a2e] border border-[#30305a] shadow-2xl overflow-hidden flex flex-col ${
                        isMaximized 
                            ? 'w-full h-full max-w-none max-h-none' 
                            : 'w-full max-w-4xl max-h-[85vh]'
                    }`}
                    style={{
                        boxShadow: '0 0 60px rgba(0, 200, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                >
                    {/* Terminal Window Header */}
                    <div className="bg-gradient-to-r from-[#0d0d1a] to-[#1a1a2e] border-b border-[#30305a] px-3 py-2 flex items-center justify-between shrink-0">
                        {/* Window controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors group relative"
                            >
                                <X className="w-2 h-2 text-red-900 absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors group relative">
                                <Minus className="w-2 h-2 text-yellow-900 absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button 
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors group relative"
                            >
                                <Square className="w-1.5 h-1.5 text-green-900 absolute top-[3px] left-[3px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                        
                        {/* Title bar */}
                        <div className="flex items-center gap-2 text-[#6a6a9a]">
                            <Terminal className="w-4 h-4" />
                            <span className="text-xs font-mono">CODE_VIEWER.exe</span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded transition-colors text-primary"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span className="text-[10px] font-mono">{copied ? 'COPIED' : 'COPY'}</span>
                            </button>
                            <div className="w-px h-4 bg-[#30305a] mx-1" />
                            <button 
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-1 hover:bg-[#30305a] rounded transition-colors"
                                title={isMaximized ? "Restore" : "Maximize"}
                            >
                                <Maximize2 className="w-3.5 h-3.5 text-[#6a6a9a]" />
                            </button>
                            <button 
                                onClick={onClose}
                                className="p-1 hover:bg-[#30305a] rounded transition-colors"
                                title="Close Viewer"
                            >
                                <X className="w-3.5 h-3.5 text-[#6a6a9a]" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Terminal status bar */}
                    <div className="bg-[#0d0d1a] border-b border-[#30305a] px-4 py-1.5 flex items-center justify-between text-[10px] font-mono shrink-0">
                        <div className="flex items-center gap-4 text-[#4a9eff]">
                            <div className="flex items-center gap-2">
                                <span className="text-[#6a6a9a]">SELECT_FRAMEWORK:</span>
                                <select 
                                    className="bg-transparent border-none focus:ring-0 text-[#4a9eff] cursor-pointer"
                                    value={selectedFramework.id}
                                    onChange={(e) => {
                                        const fw = frameworks.find(f => f.id === e.target.value);
                                        if (fw) setSelectedFramework(fw as any);
                                    }}
                                >
                                    {frameworks.map(fw => (
                                        <option key={fw.id} value={fw.id} className="bg-[#1a1a2e] text-white">
                                            {fw.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[#6a6a9a]">
                            <span>LINES: <span className="text-[#4a9eff]">{generatedCode.split('\n').length}</span></span>
                            <span className="text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                SYNCED
                            </span>
                        </div>
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 overflow-auto bg-[#0d0d1a] p-4 font-mono text-sm relative group">
                        <div className="flex h-full">
                            {/* Line numbers */}
                            <div className="pr-4 border-r border-[#30305a] text-[#30305a] select-none text-right min-w-[3rem]">
                                {generatedCode.split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>
                            {/* Code */}
                            <pre className="pl-4 text-[#a9b1d6] whitespace-pre">
                                <code>{generatedCode}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Terminal Footer */}
                    <div className="bg-[#0d0d1a] border-t border-[#30305a] px-4 py-2 flex items-center justify-between text-[10px] font-mono shrink-0">
                        <div className="flex items-center gap-2 text-[#6a6a9a]">
                            <span className="text-blue-400">●</span>
                            <span>source_code_viewer_v1.0.0</span>
                        </div>
                        <div className="flex items-center gap-4 text-[#6a6a9a]">
                            <span className="hidden sm:inline">UTF-8</span>
                            <span>|</span>
                            <span>SIGNATURE.PRO ENGINE</span>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
