import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Minus, Square, Terminal, Eye, Maximize2, Monitor, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    formTitle: string;
    formDescription: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[];
}

export function PreviewModal({
    isOpen,
    onClose,
    formTitle,
    formDescription,
    fields
}: PreviewModalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [formData, setFormData] = useState<Record<string, string | boolean>>({});

    const handleInputChange = (fieldId: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const renderField = (field: { id: string; type: string; label: string; placeholder?: string; required?: boolean; options?: string[] }) => {
        const baseInputClass = "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'tel':
            case 'url':
            case 'number':
                return (
                    <input
                        type={field.type}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={baseInputClass}
                        value={formData[field.id] as string || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={`${baseInputClass} min-h-[100px] resize-y`}
                        rows={4}
                        value={formData[field.id] as string || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                );
            case 'select':
                return (
                    <select 
                        className={`${baseInputClass} cursor-pointer`}
                        value={formData[field.id] as string || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                    >
                        <option value="">Select an option...</option>
                        {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return (
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                            checked={formData[field.id] as boolean || false}
                            onChange={(e) => handleInputChange(field.id, e.target.checked)}
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {field.label}
                        </span>
                    </label>
                );
            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((opt, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name={field.id}
                                    value={opt}
                                    className="w-5 h-5 border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                                    checked={formData[field.id] === opt}
                                    onChange={() => handleInputChange(field.id, opt)}
                                />
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                    {opt}
                                </span>
                            </label>
                        ))}
                    </div>
                );
            case 'date':
                return <input type="date" className={baseInputClass} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
            case 'time':
                return <input type="time" className={baseInputClass} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
            case 'datetime':
                return <input type="datetime-local" className={baseInputClass} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
            case 'file':
                return (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/50">
                        <input type="file" className="hidden" id={`file-${field.id}`} />
                        <label htmlFor={`file-${field.id}`} className="cursor-pointer">
                            <div className="text-gray-500 dark:text-gray-400">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm">Click to upload or drag and drop</span>
                            </div>
                        </label>
                    </div>
                );
            case 'toggle':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData[field.id] as boolean || false}
                            onChange={(e) => handleInputChange(field.id, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                );
            case 'rating':
                return (
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleInputChange(field.id, star.toString())}
                                className={`text-2xl transition-colors ${
                                    Number(formData[field.id]) >= star 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-300 hover:text-yellow-300'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                );
            default:
                return (
                    <input
                        type="text"
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={baseInputClass}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                );
        }
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
                    className={`w-full ${
                        isMaximized 
                            ? 'h-full max-w-none max-h-none' 
                            : 'max-w-3xl max-h-[85vh]'
                    }`}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`bg-[#1a1a2e] border border-[#30305a] shadow-2xl overflow-hidden flex flex-col h-full rounded-lg`}
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
                            <span className="text-xs font-mono">PREVIEW_RENDERER.exe</span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setFormData({})}
                                className="p-1 hover:bg-[#30305a] rounded transition-colors"
                                title="Reset form"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-[#6a6a9a]" />
                            </button>
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
                                title="Close Preview"
                            >
                                <X className="w-3.5 h-3.5 text-[#6a6a9a]" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Terminal status bar */}
                    <div className="bg-[#0d0d1a] border-b border-[#30305a] px-4 py-1.5 flex items-center justify-between text-[10px] font-mono shrink-0">
                        <div className="flex items-center gap-4 text-[#4a9eff]">
                            <span className="flex items-center gap-1.5">
                                <Monitor className="w-3 h-3" />
                                LIVE_PREVIEW
                            </span>
                            <span className="text-[#6a6a9a]">|</span>
                            <span className="text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                RENDERING
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[#6a6a9a]">
                            <span>FIELDS: <span className="text-[#4a9eff]">{fields.length}</span></span>
                            <span>MODE: <span className="text-green-400">INTERACTIVE</span></span>
                        </div>
                    </div>

                    {/* Form Preview Content */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
                            {/* Form Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {formTitle || 'Untitled Form'}
                                </h1>
                                {formDescription && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formDescription}
                                    </p>
                                )}
                            </div>

                            {/* Form Fields */}
                            {fields.length === 0 ? (
                                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No fields to preview</p>
                                    <p className="text-sm mt-2">Add some fields to see them here</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {fields.map((field) => (
                                        <div key={field.id} className="space-y-2">
                                            {field.type !== 'checkbox' && field.type !== 'toggle' && (
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {field.label}
                                                    {field.required && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </label>
                                            )}
                                            {renderField(field)}
                                        </div>
                                    ))}
                                    
                                    {/* Submit button preview */}
                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/25"
                                        >
                                            Submit Form
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terminal Footer */}
                    <div className="bg-[#0d0d1a] border-t border-[#30305a] px-4 py-2 flex items-center justify-between text-[10px] font-mono shrink-0">
                        <div className="flex items-center gap-2 text-[#6a6a9a]">
                            <span className="text-green-400">●</span>
                            <span>preview_session_active</span>
                        </div>
                        <div className="flex items-center gap-4 text-[#6a6a9a]">
                            <span>ESC to close</span>
                            <span>|</span>
                            <span>SIGNATURE.PRO v2.4.0</span>
                        </div>
                    </div>
                    </motion.div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
