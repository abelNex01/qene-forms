import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';
import { useAIEditor } from './useAIEditor';
import { Header } from './Header';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Canvas } from './Canvas';
import { ExportModal } from './ExportModal';
import { PreviewModal } from './PreviewModal';
import { CodeModal } from './CodeModal';
import DecryptedText from '@/components/ui/DecryptedText';

export default function AIEditor() {
    const {
        fields,
        setFields,
        selectedField,
        setSelectedField,
        formTitle,
        setFormTitle,
        formDescription,
        setFormDescription,
        historyIndex,
        history,
        undo,
        redo,
        aiSuggestions,
        similarFields,
        isProcessing,
        optimizeLayout,
        detectSimilarFields,
        addField,
        updateField,
        deleteField,
        cloneField,
        applySuggestion,
        commitFieldChanges,
        exportJSON,
        exportCode,
        exportCSV,
        saveToHistory
    } = useAIEditor();

    const [showExportModal, setShowExportModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    

    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    

    const [isCollapsibleMode, setIsCollapsibleMode] = useState(false);
    
    useEffect(() => {
        const checkScreenSize = () => {

            setIsCollapsibleMode(window.innerWidth < 1024);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    

    const handleCanvasClick = () => {
        if (isCollapsibleMode) {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
        }
    };
    

    useEffect(() => {
        if (selectedField && isCollapsibleMode) {
            setRightSidebarOpen(true);
        }
    }, [selectedField, isCollapsibleMode]);

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

            <div className="fixed inset-0 grid-pattern pointer-events-none opacity-50" />
            

            <div className="fixed top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/3 to-transparent pointer-events-none" />
            

            <div className="fixed inset-0 scan-lines pointer-events-none opacity-30" />
            

            <Header
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                undo={undo}
                redo={redo}
                historyIndex={historyIndex}
                historyLength={history.length}
                previewMode={showPreviewModal}
                setPreviewMode={setShowPreviewModal}
                showCode={showCodeModal}
                setShowCode={setShowCodeModal}
                onExport={() => setShowExportModal(true)}
                hasFields={fields.length > 0}
                isProcessing={isProcessing}
                fieldsCount={fields.length}
                onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
                onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
                leftSidebarOpen={leftSidebarOpen}
                rightSidebarOpen={rightSidebarOpen}
                onOptimize={optimizeLayout}
            />


            <AnimatePresence>
                {(isCollapsibleMode && (leftSidebarOpen || rightSidebarOpen)) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => {
                            setLeftSidebarOpen(false);
                            setRightSidebarOpen(false);
                        }}
                    />
                )}
                {/* Mobile Sidebar - Rendered here to be above backdrop (z-50 > z-30) */}
                {isCollapsibleMode && leftSidebarOpen && (
                    <SidebarLeft
                        addField={(type) => {
                            addField(type);
                            if (isCollapsibleMode) setLeftSidebarOpen(false);
                        }}
                        isOpen={leftSidebarOpen}
                        onClose={() => setLeftSidebarOpen(false)}
                        isCollapsible={isCollapsibleMode}
                        onGenerate={async (prompt) => {
                             console.warn("AI Generation is temporarily unavailable.");
                        }}
                    />
                )}
                {/* Mobile Right Sidebar - Above backdrop */}
                {isCollapsibleMode && rightSidebarOpen && (
                        <SidebarRight
                            selectedField={selectedField}
                            setSelectedField={setSelectedField}
                            selectedFieldData={fields.find(f => f.id === selectedField)}
                            updateField={updateField}
                            commitFieldChanges={commitFieldChanges}
                            aiSuggestions={aiSuggestions}
                            applySuggestion={applySuggestion}
                            fields={fields}
                            isOpen={rightSidebarOpen}
                            onClose={() => setRightSidebarOpen(false)}
                            isCollapsible={isCollapsibleMode}
                        />
                )}
            </AnimatePresence>


            <div className="flex pt-16 relative z-10" style={{ height: 'calc(100vh - 4rem)' }}>

                {/* Desktop Sidebar - Rendered in flow */}
                {!isCollapsibleMode && (
                         <SidebarLeft
                             addField={(type) => {
                                 addField(type);
                                 if (isCollapsibleMode) setLeftSidebarOpen(false);
                             }}
                             isOpen={leftSidebarOpen}
                             onClose={() => setLeftSidebarOpen(false)}
                             isCollapsible={isCollapsibleMode}
                             onGenerate={async (prompt) => {
                                 console.warn("AI Generation is temporarily unavailable.");
                             }}
                         />
                )}
                

                <div className="flex-1 min-w-0" onClick={handleCanvasClick}>
                    <Canvas
                        formTitle={formTitle}
                        setFormTitle={setFormTitle}
                        formDescription={formDescription}
                        setFormDescription={setFormDescription}
                        fields={fields}
                        setFields={setFields}
                        saveToHistory={saveToHistory} 
                        selectedField={selectedField}
                        setSelectedField={setSelectedField}
                        previewMode={false}
                        cloneField={cloneField}
                        deleteField={deleteField}
                        isProcessing={isProcessing}
                        isCollapsible={isCollapsibleMode}
                        addField={addField}
                    />
                </div>


                {/* Desktop Right Sidebar */}
                <AnimatePresence>
                    {(!isCollapsibleMode || rightSidebarOpen) && !isCollapsibleMode && (
                        <SidebarRight
                            selectedField={selectedField}
                            setSelectedField={setSelectedField}
                            selectedFieldData={fields.find(f => f.id === selectedField)}
                            updateField={updateField}
                            commitFieldChanges={commitFieldChanges}
                            aiSuggestions={aiSuggestions}
                            applySuggestion={applySuggestion}
                            fields={fields}
                            isOpen={rightSidebarOpen}
                            onClose={() => setRightSidebarOpen(false)}
                            isCollapsible={isCollapsibleMode}
                        />
                    )}
                </AnimatePresence>
            </div>
            

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-2 sm:px-4 py-2 z-40"
            >
                <div className="flex items-center justify-between text-mono text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-2 h-2 bg-success animate-pulse" />
                            <span className="hidden sm:inline">
                                <DecryptedText text="SYSTEM_READY" animateOn="view" speed={60} maxIterations={8} />
                            </span>
                            <span className="sm:hidden">OK</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>FIELDS: <span className="text-primary">{fields.length}</span></span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">HISTORY: <span className="text-cyan-400">{historyIndex + 1}/{history.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-6">
                        <span className="hidden sm:inline">QENE.FORMS</span>
                        <span>v2.4.0</span>
                    </div>
                </div>
            </motion.div>

            <ExportModal
                showExportModal={showExportModal}
                setShowExportModal={setShowExportModal}
                exportJSON={exportJSON}
                exportCode={exportCode}
                exportCSV={exportCSV}
            />

            <PreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                formTitle={formTitle}
                formDescription={formDescription}
                fields={fields}
            />

            <CodeModal
                isOpen={showCodeModal}
                onClose={() => setShowCodeModal(false)}
                formTitle={formTitle}
                formDescription={formDescription}
                fields={fields}
            />
        </div>
    );
}
