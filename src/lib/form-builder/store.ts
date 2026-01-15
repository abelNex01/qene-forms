// Form Builder Zustand Store
// Central state management for the form builder

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  FormSchema,
  FormField,
  FormSection,
  BuilderState,
  HistoryEntry,
  ExportConfig,
  FormTemplate,
  FieldType,
} from "./types";
import {
  createEmptyFormSchema,
  createDefaultField,
  DEFAULT_EXPORT_CONFIG,
  MAX_HISTORY_SIZE,
  STORAGE_KEY_TEMPLATES,
} from "./constants";

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface FormBuilderActions {
  // Schema Actions
  setSchema: (schema: FormSchema) => void;
  updateSchema: (updates: Partial<FormSchema>) => void;
  resetSchema: () => void;

  // Field Actions
  addField: (type: FieldType, sectionId?: string, index?: number) => string;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  duplicateField: (fieldId: string) => string | null;
  moveField: (fieldId: string, newIndex: number, newSectionId?: string) => void;
  reorderFields: (sectionId: string, startIndex: number, endIndex: number) => void;

  // Section Actions
  addSection: (title?: string, index?: number) => string;
  updateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  removeSection: (sectionId: string, moveFieldsToSection?: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;

  // Selection
  selectField: (fieldId: string | null) => void;
  selectSection: (sectionId: string | null) => void;

  // Clipboard
  copyField: (fieldId: string) => void;
  pasteField: (sectionId?: string) => string | null;
  cutField: (fieldId: string) => void;

  // History (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Templates
  saveAsTemplate: (name: string, description?: string, category?: string) => string;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  getTemplates: () => FormTemplate[];

  // Export
  setExportConfig: (config: Partial<ExportConfig>) => void;

  // Preview Mode
  setPreviewMode: (enabled: boolean) => void;

  // JSON Import/Export
  exportToJSON: () => string;
  importFromJSON: (json: string) => boolean;

  // Error Handling
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

type FormBuilderStore = BuilderState & FormBuilderActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function saveToHistory(
  state: BuilderState,
  action: string
): HistoryEntry[] {
  const newEntry: HistoryEntry = {
    schema: JSON.parse(JSON.stringify(state.schema)),
    timestamp: Date.now(),
    action,
  };

  // If we're not at the end of history (after some undos), truncate
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(newEntry);

  // Limit history size
  if (newHistory.length > state.maxHistorySize) {
    newHistory.shift();
  }

  return newHistory;
}

function getFieldsInSection(fields: FormField[], sectionId?: string): FormField[] {
  return fields
    .filter((f) => f.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

function reorderArray<T>(arr: T[], startIndex: number, endIndex: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useFormBuilderStore = create<FormBuilderStore>()(
  persist(
    (set, get) => ({
      // Initial State
      schema: createEmptyFormSchema(),
      selectedFieldId: null,
      selectedSectionId: null,
      clipboard: null,
      history: [],
      historyIndex: -1,
      maxHistorySize: MAX_HISTORY_SIZE,
      isPreviewMode: false,
      exportConfig: { ...DEFAULT_EXPORT_CONFIG },
      templates: [],
      isLoading: false,
      error: null,

      // Schema Actions
      setSchema: (schema) => {
        set((state) => {
          const newHistory = saveToHistory(state, "Set schema");
          return {
            schema,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            selectedFieldId: null,
            selectedSectionId: null,
          };
        });
      },

      updateSchema: (updates) => {
        set((state) => ({
          schema: {
            ...state.schema,
            ...updates,
            metadata: {
              ...state.schema.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      resetSchema: () => {
        set((state) => {
          const newHistory = saveToHistory(state, "Reset schema");
          return {
            schema: createEmptyFormSchema(),
            history: newHistory,
            historyIndex: newHistory.length - 1,
            selectedFieldId: null,
            selectedSectionId: null,
          };
        });
      },

      // Field Actions
      addField: (type, sectionId, index) => {
        const state = get();
        const targetSectionId = sectionId || state.schema.sections[0]?.id;
        const fieldsInSection = getFieldsInSection(state.schema.fields, targetSectionId);
        const order = index !== undefined ? index : fieldsInSection.length;

        const newField = createDefaultField(type, order, targetSectionId);

        // Adjust orders of fields after the insertion point
        const updatedFields = state.schema.fields.map((f) => {
          if (f.sectionId === targetSectionId && f.order >= order) {
            return { ...f, order: f.order + 1 };
          }
          return f;
        });

        const newHistory = saveToHistory(state, `Add ${type} field`);

        set({
          schema: {
            ...state.schema,
            fields: [...updatedFields, newField],
            metadata: {
              ...state.schema.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedFieldId: newField.id,
        });

        return newField.id;
      },

      updateField: (fieldId, updates) => {
        set((state) => {
          const newHistory = saveToHistory(state, "Update field");
          return {
            schema: {
              ...state.schema,
              fields: state.schema.fields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } : f
              ),
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      removeField: (fieldId) => {
        set((state) => {
          const field = state.schema.fields.find((f) => f.id === fieldId);
          if (!field) return state;

          const newHistory = saveToHistory(state, "Remove field");

          // Adjust orders of remaining fields in the section
          const updatedFields = state.schema.fields
            .filter((f) => f.id !== fieldId)
            .map((f) => {
              if (f.sectionId === field.sectionId && f.order > field.order) {
                return { ...f, order: f.order - 1 };
              }
              return f;
            });

          return {
            schema: {
              ...state.schema,
              fields: updatedFields,
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
            selectedFieldId:
              state.selectedFieldId === fieldId ? null : state.selectedFieldId,
          };
        });
      },

      duplicateField: (fieldId) => {
        const state = get();
        const field = state.schema.fields.find((f) => f.id === fieldId);
        if (!field) return null;

        const newId = crypto.randomUUID();
        const newField: FormField = {
          ...JSON.parse(JSON.stringify(field)),
          id: newId,
          name: `${field.name}_copy`,
          label: `${field.label} (Copy)`,
          order: field.order + 1,
        };

        // Adjust orders of fields after the original
        const updatedFields = state.schema.fields.map((f) => {
          if (f.sectionId === field.sectionId && f.order > field.order) {
            return { ...f, order: f.order + 1 };
          }
          return f;
        });

        const newHistory = saveToHistory(state, "Duplicate field");

        set({
          schema: {
            ...state.schema,
            fields: [...updatedFields, newField],
            metadata: {
              ...state.schema.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedFieldId: newId,
        });

        return newId;
      },

      moveField: (fieldId, newIndex, newSectionId) => {
        set((state) => {
          const field = state.schema.fields.find((f) => f.id === fieldId);
          if (!field) return state;

          const targetSectionId = newSectionId ?? field.sectionId;
          const newHistory = saveToHistory(state, "Move field");

          // Remove from old position
          let updatedFields = state.schema.fields.map((f) => {
            if (f.sectionId === field.sectionId && f.order > field.order) {
              return { ...f, order: f.order - 1 };
            }
            return f;
          });

          // Insert at new position
          updatedFields = updatedFields.map((f) => {
            if (f.id === fieldId) {
              return { ...f, sectionId: targetSectionId, order: newIndex };
            }
            if (f.sectionId === targetSectionId && f.order >= newIndex) {
              return { ...f, order: f.order + 1 };
            }
            return f;
          });

          return {
            schema: {
              ...state.schema,
              fields: updatedFields,
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      reorderFields: (sectionId, startIndex, endIndex) => {
        set((state) => {
          const sectionFields = getFieldsInSection(state.schema.fields, sectionId);
          const otherFields = state.schema.fields.filter(
            (f) => f.sectionId !== sectionId
          );

          const reordered = reorderArray(sectionFields, startIndex, endIndex).map(
            (f, i) => ({ ...f, order: i })
          );

          const newHistory = saveToHistory(state, "Reorder fields");

          return {
            schema: {
              ...state.schema,
              fields: [...otherFields, ...reordered],
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      // Section Actions
      addSection: (title, index) => {
        const state = get();
        const order = index !== undefined ? index : state.schema.sections.length;
        const newSection: FormSection = {
          id: crypto.randomUUID(),
          title: title || `Section ${state.schema.sections.length + 1}`,
          order,
          columns: 1,
        };

        // Adjust orders of sections after the insertion point
        const updatedSections = state.schema.sections.map((s) => {
          if (s.order >= order) {
            return { ...s, order: s.order + 1 };
          }
          return s;
        });

        const newHistory = saveToHistory(state, "Add section");

        set({
          schema: {
            ...state.schema,
            sections: [...updatedSections, newSection],
            metadata: {
              ...state.schema.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedSectionId: newSection.id,
        });

        return newSection.id;
      },

      updateSection: (sectionId, updates) => {
        set((state) => {
          const newHistory = saveToHistory(state, "Update section");
          return {
            schema: {
              ...state.schema,
              sections: state.schema.sections.map((s) =>
                s.id === sectionId ? { ...s, ...updates } : s
              ),
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      removeSection: (sectionId, moveFieldsToSection) => {
        set((state) => {
          if (state.schema.sections.length <= 1) {
            return { ...state, error: "Cannot remove the last section" };
          }

          const section = state.schema.sections.find((s) => s.id === sectionId);
          if (!section) return state;

          const newHistory = saveToHistory(state, "Remove section");

          const targetSectionId =
            moveFieldsToSection || state.schema.sections.find((s) => s.id !== sectionId)?.id;

          // Move fields to target section or delete them
          const updatedFields = targetSectionId
            ? state.schema.fields.map((f) =>
                f.sectionId === sectionId
                  ? { ...f, sectionId: targetSectionId }
                  : f
              )
            : state.schema.fields.filter((f) => f.sectionId !== sectionId);

          // Adjust section orders
          const updatedSections = state.schema.sections
            .filter((s) => s.id !== sectionId)
            .map((s) => (s.order > section.order ? { ...s, order: s.order - 1 } : s));

          return {
            schema: {
              ...state.schema,
              sections: updatedSections,
              fields: updatedFields,
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
            selectedSectionId:
              state.selectedSectionId === sectionId ? null : state.selectedSectionId,
          };
        });
      },

      reorderSections: (startIndex, endIndex) => {
        set((state) => {
          const sections = [...state.schema.sections].sort((a, b) => a.order - b.order);
          const reordered = reorderArray(sections, startIndex, endIndex).map(
            (s, i) => ({ ...s, order: i })
          );

          const newHistory = saveToHistory(state, "Reorder sections");

          return {
            schema: {
              ...state.schema,
              sections: reordered,
              metadata: {
                ...state.schema.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      // Selection
      selectField: (fieldId) => set({ selectedFieldId: fieldId }),
      selectSection: (sectionId) => set({ selectedSectionId: sectionId }),

      // Clipboard
      copyField: (fieldId) => {
        const state = get();
        const field = state.schema.fields.find((f) => f.id === fieldId);
        if (field) {
          set({ clipboard: JSON.parse(JSON.stringify(field)) });
        }
      },

      pasteField: (sectionId) => {
        const state = get();
        if (!state.clipboard) return null;

        const targetSectionId = sectionId || state.selectedSectionId || state.schema.sections[0]?.id;
        const fieldsInSection = getFieldsInSection(state.schema.fields, targetSectionId);

        const newId = crypto.randomUUID();
        const newField: FormField = {
          ...JSON.parse(JSON.stringify(state.clipboard)),
          id: newId,
          name: `${state.clipboard.name}_paste`,
          sectionId: targetSectionId,
          order: fieldsInSection.length,
        };

        const newHistory = saveToHistory(state, "Paste field");

        set({
          schema: {
            ...state.schema,
            fields: [...state.schema.fields, newField],
            metadata: {
              ...state.schema.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedFieldId: newId,
        });

        return newId;
      },

      cutField: (fieldId) => {
        const state = get();
        const field = state.schema.fields.find((f) => f.id === fieldId);
        if (field) {
          set({ clipboard: JSON.parse(JSON.stringify(field)) });
          get().removeField(fieldId);
        }
      },

      // History
      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const prevIndex = state.historyIndex - 1;
          const prevState = state.history[prevIndex];
          if (!prevState) return state;

          return {
            schema: JSON.parse(JSON.stringify(prevState.schema)),
            historyIndex: prevIndex,
            selectedFieldId: null,
            selectedSectionId: null,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const nextIndex = state.historyIndex + 1;
          const nextState = state.history[nextIndex];
          if (!nextState) return state;

          return {
            schema: JSON.parse(JSON.stringify(nextState.schema)),
            historyIndex: nextIndex,
            selectedFieldId: null,
            selectedSectionId: null,
          };
        });
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
      clearHistory: () => set({ history: [], historyIndex: -1 }),

      // Templates
      saveAsTemplate: (name, description, category) => {
        const state = get();
        const template: FormTemplate = {
          id: crypto.randomUUID(),
          name,
          description,
          category,
          schema: JSON.parse(JSON.stringify(state.schema)),
          createdAt: new Date().toISOString(),
        };

        set({ templates: [...state.templates, template] });
        return template.id;
      },

      loadTemplate: (templateId) => {
        const state = get();
        const template = state.templates.find((t) => t.id === templateId);
        if (template) {
          const newHistory = saveToHistory(state, "Load template");
          set({
            schema: JSON.parse(JSON.stringify(template.schema)),
            history: newHistory,
            historyIndex: newHistory.length - 1,
            selectedFieldId: null,
            selectedSectionId: null,
          });
        }
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== templateId),
        }));
      },

      getTemplates: () => get().templates,

      // Export Config
      setExportConfig: (config) => {
        set((state) => ({
          exportConfig: { ...state.exportConfig, ...config },
        }));
      },

      // Preview Mode
      setPreviewMode: (enabled) => set({ isPreviewMode: enabled }),

      // JSON Import/Export
      exportToJSON: () => {
        const state = get();
        return JSON.stringify(state.schema, null, 2);
      },

      importFromJSON: (json) => {
        try {
          const schema = JSON.parse(json) as FormSchema;
          // Basic validation
          if (!schema.version || !schema.id || !schema.fields || !schema.sections) {
            throw new Error("Invalid schema format");
          }
          get().setSchema(schema);
          return true;
        } catch (e) {
          set({ error: "Failed to import JSON: Invalid format" });
          return false;
        }
      },

      // Error Handling
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: STORAGE_KEY_TEMPLATES,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        templates: state.templates,
        exportConfig: state.exportConfig,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectSchema = (state: FormBuilderStore) => state.schema;
export const selectFields = (state: FormBuilderStore) => state.schema.fields;
export const selectSections = (state: FormBuilderStore) => state.schema.sections;
export const selectSelectedField = (state: FormBuilderStore) =>
  state.schema.fields.find((f) => f.id === state.selectedFieldId);
export const selectSelectedSection = (state: FormBuilderStore) =>
  state.schema.sections.find((s) => s.id === state.selectedSectionId);
export const selectFieldsInSection = (sectionId: string) => (state: FormBuilderStore) =>
  state.schema.fields
    .filter((f) => f.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
