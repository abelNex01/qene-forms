// Form Builder Custom Hook
// Simplified interface to the form builder store

import { useCallback, useMemo } from "react";
import {
  useFormBuilderStore,
  selectSchema,
  selectFields,
  selectSections,
  selectSelectedField,
  selectSelectedSection,
  selectFieldsInSection,
} from "@/lib/form-builder/store";
import type {
  FormSchema,
  FormField,
  FormSection,
  FieldType,
  ExportConfig,
  ValidationRule,
  ConditionalLogic,
} from "@/lib/form-builder/types";

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useFormBuilder() {
  const store = useFormBuilderStore();

  // Select values from store
  const schema = useFormBuilderStore(selectSchema);
  const fields = useFormBuilderStore(selectFields);
  const sections = useFormBuilderStore(selectSections);
  const selectedField = useFormBuilderStore(selectSelectedField);
  const selectedSection = useFormBuilderStore(selectSelectedSection);

  // Computed values
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections]
  );

  const hasUnsavedChanges = useMemo(() => {
    return store.history.length > 0;
  }, [store.history.length]);

  // Field actions with stable references
  const addField = useCallback(
    (type: FieldType, sectionId?: string, index?: number) => {
      return store.addField(type, sectionId, index);
    },
    [store]
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      store.updateField(fieldId, updates);
    },
    [store]
  );

  const removeField = useCallback(
    (fieldId: string) => {
      store.removeField(fieldId);
    },
    [store]
  );

  const duplicateField = useCallback(
    (fieldId: string) => {
      return store.duplicateField(fieldId);
    },
    [store]
  );

  const moveField = useCallback(
    (fieldId: string, newIndex: number, newSectionId?: string) => {
      store.moveField(fieldId, newIndex, newSectionId);
    },
    [store]
  );

  // Section actions
  const addSection = useCallback(
    (title?: string, index?: number) => {
      return store.addSection(title, index);
    },
    [store]
  );

  const updateSection = useCallback(
    (sectionId: string, updates: Partial<FormSection>) => {
      store.updateSection(sectionId, updates);
    },
    [store]
  );

  const removeSection = useCallback(
    (sectionId: string, moveFieldsToSection?: string) => {
      store.removeSection(sectionId, moveFieldsToSection);
    },
    [store]
  );

  // History actions
  const undo = useCallback(() => store.undo(), [store]);
  const redo = useCallback(() => store.redo(), [store]);
  const canUndo = store.canUndo();
  const canRedo = store.canRedo();

  // Clipboard actions
  const copyField = useCallback(
    (fieldId: string) => store.copyField(fieldId),
    [store]
  );
  const pasteField = useCallback(
    (sectionId?: string) => store.pasteField(sectionId),
    [store]
  );
  const cutField = useCallback(
    (fieldId: string) => store.cutField(fieldId),
    [store]
  );

  // Selection
  const selectField = useCallback(
    (fieldId: string | null) => store.selectField(fieldId),
    [store]
  );
  const selectSection = useCallback(
    (sectionId: string | null) => store.selectSection(sectionId),
    [store]
  );

  // Schema operations
  const exportToJSON = useCallback(() => store.exportToJSON(), [store]);
  const importFromJSON = useCallback(
    (json: string) => store.importFromJSON(json),
    [store]
  );
  const resetSchema = useCallback(() => store.resetSchema(), [store]);
  const setSchema = useCallback(
    (schema: FormSchema) => store.setSchema(schema),
    [store]
  );

  const updateSchema = useCallback(
    (updates: Partial<FormSchema>) => store.updateSchema(updates),
    [store]
  );

  // Template operations
  const saveAsTemplate = useCallback(
    (name: string, description?: string, category?: string) =>
      store.saveAsTemplate(name, description, category),
    [store]
  );
  const loadTemplate = useCallback(
    (templateId: string) => store.loadTemplate(templateId),
    [store]
  );
  const deleteTemplate = useCallback(
    (templateId: string) => store.deleteTemplate(templateId),
    [store]
  );

  // Export config
  const setExportConfig = useCallback(
    (config: Partial<ExportConfig>) => store.setExportConfig(config),
    [store]
  );

  // Preview mode
  const setPreviewMode = useCallback(
    (enabled: boolean) => store.setPreviewMode(enabled),
    [store]
  );

  return {
    // State
    schema,
    fields,
    sections: sortedSections,
    selectedField,
    selectedSection,
    selectedFieldId: store.selectedFieldId,
    selectedSectionId: store.selectedSectionId,
    clipboard: store.clipboard,
    isPreviewMode: store.isPreviewMode,
    exportConfig: store.exportConfig,
    templates: store.templates,
    isLoading: store.isLoading,
    error: store.error,
    hasUnsavedChanges,
    canUndo,
    canRedo,

    // Field Actions
    addField,
    updateField,
    removeField,
    duplicateField,
    moveField,

    // Section Actions
    addSection,
    updateSection,
    removeSection,

    // Selection
    selectField,
    selectSection,

    // Clipboard
    copyField,
    pasteField,
    cutField,

    // History
    undo,
    redo,

    // Schema
    exportToJSON,
    importFromJSON,
    setSchema,
    resetSchema,
    updateSchema,

    // Templates
    saveAsTemplate,
    loadTemplate,
    deleteTemplate,

    // Export
    setExportConfig,

    // Preview
    setPreviewMode,

    // Error
    setError: store.setError,
    clearError: () => store.setError(null),
  };
}

// ============================================================================
// FIELD-SPECIFIC HOOKS
// ============================================================================

/**
 * Hook to get fields in a specific section
 */
export function useFieldsInSection(sectionId: string) {
  return useFormBuilderStore(selectFieldsInSection(sectionId));
}

/**
 * Hook to manage a specific field's configuration
 */
export function useFieldConfig(fieldId: string) {
  const store = useFormBuilderStore();
  const field = store.schema.fields.find((f) => f.id === fieldId);

  const updateLabel = useCallback(
    (label: string) => {
      store.updateField(fieldId, { label });
    },
    [store, fieldId]
  );

  const updatePlaceholder = useCallback(
    (placeholder: string) => {
      store.updateField(fieldId, { placeholder });
    },
    [store, fieldId]
  );

  const updateName = useCallback(
    (name: string) => {
      store.updateField(fieldId, { name });
    },
    [store, fieldId]
  );

  const updateDefaultValue = useCallback(
    (defaultValue: string | number | boolean | string[]) => {
      store.updateField(fieldId, { defaultValue });
    },
    [store, fieldId]
  );

  const updateValidation = useCallback(
    (validation: ValidationRule[]) => {
      store.updateField(fieldId, { validation });
    },
    [store, fieldId]
  );

  const addValidationRule = useCallback(
    (rule: ValidationRule) => {
      if (!field) return;
      store.updateField(fieldId, {
        validation: [...field.validation, rule],
      });
    },
    [store, fieldId, field]
  );

  const removeValidationRule = useCallback(
    (index: number) => {
      if (!field) return;
      const newValidation = [...field.validation];
      newValidation.splice(index, 1);
      store.updateField(fieldId, { validation: newValidation });
    },
    [store, fieldId, field]
  );

  const updateConditionalLogic = useCallback(
    (conditionalLogic: ConditionalLogic | undefined) => {
      store.updateField(fieldId, { conditionalLogic });
    },
    [store, fieldId]
  );

  const updateColSpan = useCallback(
    (colSpan: 1 | 2 | 3 | 4) => {
      store.updateField(fieldId, { colSpan });
    },
    [store, fieldId]
  );

  const setRequired = useCallback(
    (required: boolean) => {
      if (!field) return;
      const existingRequired = field.validation.findIndex(
        (v) => v.type === "required"
      );

      if (required && existingRequired === -1) {
        addValidationRule({
          type: "required",
          message: "This field is required",
        });
      } else if (!required && existingRequired !== -1) {
        removeValidationRule(existingRequired);
      }
    },
    [field, addValidationRule, removeValidationRule]
  );

  const isRequired = useMemo(() => {
    return field?.validation.some((v) => v.type === "required") ?? false;
  }, [field]);

  return {
    field,
    isRequired,
    updateLabel,
    updatePlaceholder,
    updateName,
    updateDefaultValue,
    updateValidation,
    addValidationRule,
    removeValidationRule,
    updateConditionalLogic,
    updateColSpan,
    setRequired,
  };
}

/**
 * Hook to manage form settings
 */
export function useFormSettings() {
  const store = useFormBuilderStore();
  const settings = store.schema.settings;

  const updateSettings = useCallback(
    (updates: Partial<typeof settings>) => {
      store.updateSchema({
        settings: { ...settings, ...updates },
      });
    },
    [store, settings]
  );

  return {
    settings,
    updateSettings,
    setSubmitButtonText: (text: string) =>
      updateSettings({ submitButtonText: text }),
    setResetButtonText: (text: string | undefined) =>
      updateSettings({ resetButtonText: text }),
    setShowLabels: (show: boolean) => updateSettings({ showLabels: show }),
    setShowRequiredAsterisk: (show: boolean) =>
      updateSettings({ showRequiredAsterisk: show }),
    setLayout: (layout: "single" | "wizard") => updateSettings({ layout }),
    setDefaultColumns: (columns: 1 | 2 | 3 | 4) =>
      updateSettings({ defaultColumns: columns }),
    setEnableValidation: (enable: boolean) =>
      updateSettings({ enableValidation: enable }),
    setValidationTrigger: (trigger: "onChange" | "onBlur" | "onSubmit") =>
      updateSettings({ validationTrigger: trigger }),
  };
}
