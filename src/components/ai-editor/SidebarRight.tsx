import React from 'react';
import { Settings, X, Plus, Code, Braces, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';
import { FIELD_TYPES, VALIDATION_RULES } from './constants';

interface SidebarRightProps {
    selectedField: string | null;
    setSelectedField: (id: string | null) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedFieldData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateField: (id: string, updates: any) => void;
    commitFieldChanges: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: any[];
    isOpen?: boolean;
    onClose?: () => void;
    isCollapsible?: boolean;
}

export function SidebarRight({
    selectedField,
    setSelectedField,
    selectedFieldData,
    updateField,
    commitFieldChanges,
    fields,
    isOpen = false,
    onClose,
    isCollapsible = false
}: SidebarRightProps) {
  const sidebarContent = (
    <>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20" />
      
      {selectedFieldData ? (
        <div className="relative">
          {/* Header with close button */}
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-3 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Braces className="w-4 h-4 text-primary" />
                <span className="text-mono text-xs text-primary font-bold">
                  <DecryptedText text="FIELD_INSPECTOR" animateOn="view" speed={50} maxIterations={10} />
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedField(null);
                  if (isCollapsible && onClose) onClose();
                }}
                className="p-1.5 hover:bg-muted border border-transparent hover:border-border transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="text-mono text-[10px] text-muted-foreground mt-1">
              // ID: {selectedField?.slice(0, 8)}...
            </div>
          </div>

          <div className="p-3 sm:p-4 space-y-4 sm:space-y-5">
            {/* Field Label */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] text-purple-400">const</span>
                <span className="text-mono text-xs text-foreground">label</span>
                <span className="text-mono text-[10px] text-muted-foreground">=</span>
              </div>
              <input
                type="text"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                onBlur={commitFieldChanges}
                className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground transition-colors"
                placeholder='"Enter label..."'
              />
            </div>

            {/* Field Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] text-purple-400">type</span>
                <span className="text-mono text-xs text-foreground">fieldType</span>
                <span className="text-mono text-[10px] text-muted-foreground">:</span>
              </div>
              <select
                value={selectedFieldData.type}
                onChange={(e) => { updateField(selectedField!, { type: e.target.value }); commitFieldChanges(); }}
                className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
              >
                {FIELD_TYPES.map(({ type, label }) => (
                  <option key={type} value={type}>{label}</option>
                ))}
              </select>
            </div>

            {/* Placeholder */}
            {!['checkbox', 'radio', 'select', 'rating', 'file', 'toggle', 'section'].includes(selectedFieldData.type) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-mono text-[10px] text-purple-400">const</span>
                  <span className="text-mono text-xs text-foreground">placeholder</span>
                  <span className="text-mono text-[10px] text-muted-foreground">=</span>
                </div>
                <input
                  type="text"
                  value={selectedFieldData.placeholder}
                  onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                  onBlur={commitFieldChanges}
                  className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-foreground"
                  placeholder='"Type here..."'
                />
              </div>
            )}

            {/* Options for select/radio */}
            {['select', 'radio'].includes(selectedFieldData.type) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-mono text-[10px] text-purple-400">const</span>
                  <span className="text-mono text-xs text-foreground">options</span>
                  <span className="text-mono text-[10px] text-muted-foreground">= [</span>
                </div>
                <div className="space-y-1 pl-3 sm:pl-4 border-l-2 border-muted">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {selectedFieldData.options?.map((opt: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...selectedFieldData.options];
                          newOptions[i] = e.target.value;
                          updateField(selectedField!, { options: newOptions });
                        }}
                        onBlur={commitFieldChanges}
                        className="flex-1 min-w-0 px-2 py-1.5 border border-border bg-muted/30 font-mono text-xs focus:outline-none focus:border-primary text-foreground"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options.filter((_: unknown, idx: number) => idx !== i);
                          updateField(selectedField!, { options: newOptions });
                          commitFieldChanges();
                        }}
                        className="p-1 hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateField(selectedField!, { 
                        options: [...(selectedFieldData.options || []), `Option ${(selectedFieldData.options?.length || 0) + 1}`] 
                      });
                      commitFieldChanges();
                    }}
                    className="flex items-center gap-2 text-mono text-[11px] text-primary hover:text-primary/80 mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    push(new_option)
                  </button>
                </div>
                <div className="text-mono text-[10px] text-muted-foreground">];</div>
              </div>
            )}

            {/* Validation */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Code className="w-3 h-3 text-cyan-400" />
                <span className="text-mono text-xs text-cyan-400">validation</span>
              </div>
              <select
                value={selectedFieldData.validation}
                onChange={(e) => { updateField(selectedField!, { validation: e.target.value }); commitFieldChanges(); }}
                className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
              >
                <option value="none">// none</option>
                {Object.entries(VALIDATION_RULES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Custom Pattern */}
            {selectedFieldData.validation === 'custom' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-mono text-[10px] text-orange-400">regex</span>
                  <span className="text-mono text-xs text-foreground">pattern</span>
                </div>
                <input
                  type="text"
                  value={selectedFieldData.customPattern}
                  onChange={(e) => updateField(selectedField!, { customPattern: e.target.value })}
                  onBlur={commitFieldChanges}
                  placeholder="/^[A-Z].+$/"
                  className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-orange-400"
                />
              </div>
            )}

            {/* Min/Max for number */}
            {selectedFieldData.type === 'number' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-mono text-[10px] text-muted-foreground">min:</span>
                  <input
                    type="number"
                    value={selectedFieldData.minValue}
                    onChange={(e) => updateField(selectedField!, { minValue: e.target.value })}
                    onBlur={commitFieldChanges}
                    className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-mono text-[10px] text-muted-foreground">max:</span>
                  <input
                    type="number"
                    value={selectedFieldData.maxValue}
                    onChange={(e) => updateField(selectedField!, { maxValue: e.target.value })}
                    onBlur={commitFieldChanges}
                    className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-mono text-[10px] text-red-400">required</span>
                <span className="text-mono text-xs text-foreground">:</span>
                <span className="text-mono text-xs text-cyan-400">{selectedFieldData.required ? 'true' : 'false'}</span>
              </div>
              <button
                onClick={() => { updateField(selectedField!, { required: !selectedFieldData.required }); commitFieldChanges(); }}
                className={`relative w-12 h-6 transition-colors border ${
                  selectedFieldData.required 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-muted border-border'
                }`}
              >
                <motion.span
                  animate={{ x: selectedFieldData.required ? 24 : 2 }}
                  className={`absolute top-1 left-0 w-4 h-4 transition-colors ${
                    selectedFieldData.required ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                />
              </button>
            </div>

            {/* Conditional Logic */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-mono text-[10px] text-yellow-400">if</span>
                <span className="text-mono text-xs text-foreground">(condition)</span>
              </div>
              <select
                value={selectedFieldData.conditionalLogic?.dependsOn || ''}
                onChange={(e) => {
                  updateField(selectedField!, {
                    conditionalLogic: e.target.value
                      ? { dependsOn: e.target.value, showWhen: 'any' }
                      : null
                  });
                  commitFieldChanges();
                }}
                className="w-full px-3 py-2 border border-border bg-muted/30 font-mono text-xs focus:outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
              >
                <option value="">// always visible</option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {fields.filter((f: any) => f.id !== selectedField).map((f: any) => (
                  <option key={f.id} value={f.id}>show when "{f.label}" has value</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
          {/* Mobile/Tablet close button when no selection */}
          {isCollapsible && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-muted border border-transparent hover:border-border transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center border border-border bg-muted/20">
              <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <div>
              <div className="text-mono text-xs text-muted-foreground mb-2">
                <DecryptedText text="NO_SELECTION" animateOn="view" speed={50} maxIterations={10} />
              </div>
              <p className="text-mono text-[10px] text-muted-foreground/60">
                // Click a field to inspect
              </p>
            </div>
            
            {/* Decorative code block */}
            <div className="mt-6 p-3 border border-border bg-muted/10 text-left">
              <div className="text-mono text-[10px] text-muted-foreground">
                <span className="text-purple-400">const</span> field = <span className="text-cyan-400">null</span>;
              </div>
              <div className="text-mono text-[10px] text-muted-foreground mt-1">
                <span className="text-yellow-400">await</span> selection...
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );

  // Mobile/Tablet: Slide-in overlay from right
  if (isCollapsible) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-16 bottom-0 w-80 max-w-[90vw] bg-card border-l border-border overflow-y-auto z-50"
      >
        {sidebarContent}
      </motion.div>
    );
  }

  // Desktop: Inline sidebar (1024px+)
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 lg:w-72 xl:w-80 bg-card border-l border-border overflow-y-auto relative shrink-0 hidden lg:block"
    >
      {sidebarContent}
    </motion.div>
  );
}
