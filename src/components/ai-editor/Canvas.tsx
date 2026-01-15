import React from 'react';
import { Type, Star, Upload, Copy, Trash2, GripVertical, FileCode, Circle, ChevronRight } from 'lucide-react';
import { Reorder, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import DecryptedText from '@/components/ui/DecryptedText';
import { FIELD_TYPES } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderFieldPreview = (field: any) => {
    const baseClasses = "w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground transition-colors";
    
    switch (field.type) {
      case 'textarea':
        return <textarea className={baseClasses} placeholder={field.placeholder} rows={3} />;
      case 'select':
        return (
          <select className={baseClasses}>
            <option value="">// Select option...</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {field.options?.map((opt: any, i: number) => <option key={i}>{opt}</option>)}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 border border-border bg-muted/30 flex items-center justify-center group-hover:border-primary transition-colors">
              <div className="w-3 h-3 bg-transparent group-hover:bg-primary/20 transition-colors" />
            </div>
            <span className="text-foreground font-mono text-sm">{field.label}</span>
          </label>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {field.options?.map((opt: any, i: number) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-foreground font-mono text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <Star key={n} className="w-6 h-6 text-muted-foreground hover:text-yellow-400 cursor-pointer transition-colors" />
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-border p-4 sm:p-6 text-center hover:border-primary cursor-pointer transition-colors bg-muted/10">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground mb-2" />
            <span className="text-muted-foreground text-mono text-[10px] sm:text-xs">DROP_FILE || CLICK</span>
          </div>
        );
      case 'toggle':
        return (
          <button className="relative w-12 h-6 bg-muted border border-border transition-colors">
            <span className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground transition-transform" />
          </button>
        );
      case 'date':
        return <input type="date" className={baseClasses} />;
      case 'time':
        return <input type="time" className={baseClasses} />;
      case 'datetime':
        return <input type="datetime-local" className={baseClasses} />;
      default:
        return <input type={field.type} className={baseClasses} placeholder={field.placeholder} />;
    }
  };

interface CanvasProps {
    formTitle: string;
    setFormTitle: (title: string) => void;
    formDescription: string;
    setFormDescription: (desc: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFields: (fields: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveToHistory: (fields: any[]) => void;
    selectedField: string | null;
    setSelectedField: (id: string | null) => void;
    previewMode: boolean;
    cloneField: (id: string) => void;
    deleteField: (id: string) => void;
    isProcessing?: boolean;
    isCollapsible?: boolean;
    addField: (type: string) => void;
}

export function Canvas({
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    fields,
    setFields,
    saveToHistory,
    selectedField,
    setSelectedField,
    previewMode,
    cloneField,
    deleteField,
    isProcessing = false,
    isCollapsible = false,
    addField
}: CanvasProps) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const type = e.dataTransfer.getData('text/plain');
    if (type) {
      addField(type);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background relative">
      {/* Full grid pattern background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-3 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* File tab header */}
          <div className="flex items-center gap-2 mb-0">
            <div className="flex items-center gap-2 bg-card border-t border-l border-r border-border px-3 sm:px-4 py-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-mono text-xs text-foreground truncate max-w-[120px] sm:max-w-none">{formTitle || 'untitled'}.form</span>
              <span className="w-2 h-2 bg-success ml-2 shrink-0" />
            </div>
            <div className="flex-1 border-b border-border" />
          </div>
          
          {/* Main form container - styled like code editor */}
          <div className="bg-card border border-border relative overflow-hidden">
            {/* Top toolbar */}
            <div className="border-b border-border px-3 sm:px-4 py-2 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-mono text-[10px] text-muted-foreground hidden sm:inline">FORM_SCHEMA</span>
                <span className="text-mono text-[10px] text-muted-foreground hidden sm:inline">•</span>
                <span className="text-mono text-[10px] text-primary">{fields.length} fields</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] text-muted-foreground">
                  {previewMode ? 'PREVIEW' : 'EDIT'}
                </span>
                <div className={`w-2 h-2 ${previewMode ? 'bg-yellow-500' : 'bg-success'}`} />
              </div>
            </div>
            
            {/* Content with line numbers */}
            <div className="flex">
              {/* Line numbers column - hidden on very small screens */}
              <div className="w-8 sm:w-12 bg-muted/10 border-r border-border py-4 sm:py-6 flex flex-col items-end pr-2 sm:pr-3 select-none hidden xs:flex">
                <span className="text-mono text-[10px] text-muted-foreground leading-8">01</span>
                <span className="text-mono text-[10px] text-muted-foreground leading-8">02</span>
                {fields.map((_, i) => (
                  <span key={i} className="text-mono text-[10px] text-muted-foreground leading-[4.5rem]">
                    {String(i + 3).padStart(2, '0')}
                  </span>
                ))}
              </div>
              
              {/* Main content area */}
              <div className="flex-1 p-4 sm:p-6 min-w-0">
                {/* Form header */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-mono text-[10px] text-purple-400">export</span>
                    <span className="text-mono text-[10px] text-cyan-400">function</span>
                  </div>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="text-lg sm:text-xl font-bold text-foreground w-full border-none focus:outline-none focus:ring-0 bg-transparent font-mono"
                    placeholder="FormComponent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="text-muted-foreground w-full border-none focus:outline-none focus:ring-0 resize-none bg-transparent text-sm font-mono"
                      placeholder="// Form description..."
                      rows={1}
                    />
                  </div>
                </div>

                {/* Fields area */}
                <div 
                  className={`space-y-3 min-h-[400px] transition-colors relative ${isDraggingOver ? 'bg-primary/5' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDraggingOver && (
                    <div className="absolute inset-0 border-2 border-dashed border-primary/50 pointer-events-none z-20 flex items-center justify-center">
                      <div className="bg-primary/10 backdrop-blur-sm px-4 py-2 text-primary text-mono text-xs font-bold">
                        DROP TO ADD FIELD
                      </div>
                    </div>
                  )}
                  {fields.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 sm:py-16 border-2 border-dashed border-border bg-muted/5"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center border border-border bg-muted/20">
                        <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                      </div>
                      <p className="text-mono text-xs text-muted-foreground mb-2">
                        <DecryptedText text="NO_FIELDS_DEFINED" animateOn="view" speed={50} maxIterations={10} />
                      </p>
                      <p className="text-mono text-[10px] text-muted-foreground/60 px-4">
                        {isCollapsible ? '// Tap menu to add fields' : '// Click a field type from the sidebar to add'}
                      </p>
                    </motion.div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={fields}
                      onReorder={(newFields) => {
                        setFields(newFields);
                        saveToHistory(newFields);
                      }}
                      className="space-y-3"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {fields.map((field: any, index: number) => (
                        <Reorder.Item
                          key={field.id}
                          value={field}
                          className={`group relative bg-card border cursor-move transition-all ${
                            selectedField === field.id
                              ? 'border-primary ring-1 ring-primary/20'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                          onClick={() => !previewMode && setSelectedField(field.id)}
                        >
                          {/* Neo border accent on selection */}
                          {selectedField === field.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                          )}
                          
                          <div className="p-3 sm:p-4">
                            {previewMode ? (
                              <div>
                                {field.type !== 'checkbox' && field.type !== 'toggle' && (
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <label className="block text-sm font-mono text-foreground">
                                      {field.label}
                                    </label>
                                    {field.required && (
                                      <span className="text-mono text-[10px] text-red-400">*required</span>
                                    )}
                                  </div>
                                )}
                                {renderFieldPreview(field)}
                              </div>
                            ) : (
                              <div className="flex items-start gap-2 sm:gap-3">
                                {/* Drag handle */}
                                <div className="mt-1 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                                  <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                                </div>
                                
                                {/* Field content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                                    {/* Field index */}
                                    <span className="text-mono text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5">
                                      [{index}]
                                    </span>
                                    
                                    {/* Field icon */}
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary/10 shrink-0">
                                      {React.createElement(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        FIELD_TYPES.find(f => f.type === field.type)?.icon || Type as any,
                                        { className: 'w-3 h-3 text-primary' }
                                      )}
                                    </div>
                                    
                                    {/* Field label */}
                                    <span className="text-sm font-mono text-foreground truncate max-w-[120px] sm:max-w-none">
                                      {field.label}
                                    </span>
                                    
                                    {/* Type badge - hidden on very small screens */}
                                    <span className="text-mono text-[10px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 hidden sm:inline">
                                      {field.type}
                                    </span>
                                    
                                    {/* Required badge */}
                                    {field.required && (
                                      <span className="text-mono text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5">
                                        *
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Field preview - hidden on mobile for cleaner look */}
                                  <div className="opacity-60 pointer-events-none pl-0 sm:pl-8 hidden sm:block">
                                    {renderFieldPreview(field)}
                                  </div>
                                </div>
                                
                                {/* Actions - always visible on mobile/tablet */}
                                <div className={`flex items-center gap-1 ${isCollapsible ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity shrink-0`}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); cloneField(field.id); }}
                                    className="p-1.5 hover:bg-muted border border-transparent hover:border-border transition-colors"
                                    title="Clone field"
                                  >
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                    className="p-1.5 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-colors"
                                    title="Delete field"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom status bar */}
            <div className="border-t border-border px-3 sm:px-4 py-2 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2 sm:gap-4 text-mono text-[10px] text-muted-foreground">
                <span className="hover:text-primary cursor-pointer transition-colors">UTF-8</span>
                <span className="hidden sm:inline">•</span>
                <span className="hover:text-primary cursor-pointer transition-colors hidden sm:inline">
                    {fields.length > 0 ? 'TypeScript React' : 'JSON Schema'}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-success opacity-80 hidden sm:inline">LF</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] text-muted-foreground">
                    Ln {selectedField ? fields.findIndex(f => f.id === selectedField) + 3 : 2}, 
                    Col {selectedField ? (fields.find(f => f.id === selectedField)?.label?.length || 1) : (formTitle?.length || 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decorative cards - hidden on mobile/tablet */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 right-8 bg-card/80 backdrop-blur-sm border border-border p-3 hidden xl:block z-20"
      >
        <div className="text-mono text-[10px] text-muted-foreground mb-1">SCHEMA_STATUS</div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${isProcessing ? 'bg-primary animate-spin' : 'bg-success animate-pulse'}`} />
          <span className={`text-mono text-xs ${isProcessing ? 'text-primary' : 'text-success'}`}>
            {isProcessing ? 'COMPILING...' : 'VALID'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
