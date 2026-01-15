// Form Builder Type Definitions
// Core types for the React Form Builder logic layer

import { z } from "zod";

// ============================================================================
// FIELD TYPES
// ============================================================================

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file"
  | "signature"
  | "hidden";

// ============================================================================
// VALIDATION RULES
// ============================================================================

export type ValidationRuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "min"
  | "max"
  | "pattern"
  | "email"
  | "url"
  | "custom";

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number | boolean;
  message: string;
  /** Custom validation function as string (for code generation) */
  customFn?: string;
}

// ============================================================================
// CONDITIONAL LOGIC
// ============================================================================

export type ConditionalOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "isEmpty"
  | "isNotEmpty"
  | "greaterThan"
  | "lessThan";

export interface ConditionalRule {
  /** Field ID to check */
  fieldId: string;
  /** Operator for comparison */
  operator: ConditionalOperator;
  /** Value to compare against */
  value?: string | number | boolean;
}

export interface ConditionalLogic {
  /** Action to take: show or hide */
  action: "show" | "hide";
  /** How to combine multiple rules */
  logicType: "and" | "or";
  /** Rules to evaluate */
  rules: ConditionalRule[];
}

// ============================================================================
// FIELD OPTIONS (for select, radio, checkbox groups)
// ============================================================================

export interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// ============================================================================
// FORM FIELD SCHEMA
// ============================================================================

export interface FormField {
  /** Unique field identifier */
  id: string;
  /** Field type */
  type: FieldType;
  /** Display label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text below field */
  helperText?: string;
  /** Default value */
  defaultValue?: string | number | boolean | string[];
  /** Field name (for form submission) */
  name: string;
  /** Is field disabled */
  disabled?: boolean;
  /** Is field read-only */
  readOnly?: boolean;
  /** Validation rules */
  validation: ValidationRule[];
  /** Conditional visibility logic */
  conditionalLogic?: ConditionalLogic;
  /** Options for select/radio/checkbox */
  options?: FieldOption[];
  /** Grid column span (1-4) */
  colSpan?: 1 | 2 | 3 | 4;
  /** Section this field belongs to */
  sectionId?: string;
  /** Order within section */
  order: number;
  /** Additional attributes for the field */
  attributes?: Record<string, string | number | boolean>;
}

// ============================================================================
// FORM SECTION (for multi-step forms or grouped fields)
// ============================================================================

export interface FormSection {
  /** Unique section identifier */
  id: string;
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Order of section */
  order: number;
  /** Number of columns (1-4) */
  columns: 1 | 2 | 3 | 4;
  /** Is this section collapsible */
  collapsible?: boolean;
  /** Is section collapsed by default */
  defaultCollapsed?: boolean;
}

// ============================================================================
// FORM SCHEMA
// ============================================================================

export interface FormSchema {
  /** Schema version for migration support */
  version: string;
  /** Unique form identifier */
  id: string;
  /** Form name */
  name: string;
  /** Form description */
  description?: string;
  /** Form sections */
  sections: FormSection[];
  /** Form fields */
  fields: FormField[];
  /** Form-level settings */
  settings: FormSettings;
  /** Metadata */
  metadata: FormMetadata;
}

export interface FormSettings {
  /** Submit button text */
  submitButtonText: string;
  /** Reset button text (empty = no reset button) */
  resetButtonText?: string;
  /** Show field labels */
  showLabels: boolean;
  /** Show required asterisk */
  showRequiredAsterisk: boolean;
  /** Form layout: single page or multi-step */
  layout: "single" | "wizard";
  /** Default column count */
  defaultColumns: 1 | 2 | 3 | 4;
  /** Enable client-side validation */
  enableValidation: boolean;
  /** Validation trigger: onChange, onBlur, or onSubmit */
  validationTrigger: "onChange" | "onBlur" | "onSubmit";
}

export interface FormMetadata {
  /** Created timestamp */
  createdAt: string;
  /** Last modified timestamp */
  updatedAt: string;
  /** Author/creator */
  author?: string;
  /** Tags for organization */
  tags?: string[];
}

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export type ExportLanguage = "javascript" | "typescript";
export type ExportStyling = "tailwind" | "css" | "none";
export type ExportValidation = "native" | "custom" | "zod" | "yup" | "none";

export interface ExportConfig {
  /** Output language */
  language: ExportLanguage;
  /** Styling approach */
  styling: ExportStyling;
  /** Validation approach */
  validation: ExportValidation;
  /** Component name */
  componentName: string;
  /** Include TypeScript types file */
  includeTypes: boolean;
  /** Include README */
  includeReadme: boolean;
  /** Include CSS file (if styling is 'css') */
  includeCssFile: boolean;
  /** Use React Hook Form integration */
  useReactHookForm: boolean;
  /** Use Formik integration */
  useFormik: boolean;
}

// ============================================================================
// BUILDER STATE
// ============================================================================

export interface HistoryEntry {
  /** Snapshot of form schema */
  schema: FormSchema;
  /** Timestamp of change */
  timestamp: number;
  /** Description of change */
  action: string;
}

export interface FormTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Template category */
  category?: string;
  /** Form schema */
  schema: FormSchema;
  /** Preview image (base64) */
  preview?: string;
  /** Created timestamp */
  createdAt: string;
}

export interface BuilderState {
  /** Current form schema */
  schema: FormSchema;
  /** Currently selected field ID */
  selectedFieldId: string | null;
  /** Currently selected section ID */
  selectedSectionId: string | null;
  /** Clipboard for copy/paste */
  clipboard: FormField | null;
  /** Undo history stack */
  history: HistoryEntry[];
  /** Current position in history (for redo) */
  historyIndex: number;
  /** Maximum history size */
  maxHistorySize: number;
  /** Is builder in preview mode */
  isPreviewMode: boolean;
  /** Current export configuration */
  exportConfig: ExportConfig;
  /** Saved templates */
  templates: FormTemplate[];
  /** Is loading */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

// ============================================================================
// DRAG AND DROP
// ============================================================================

export type DragItemType = "field" | "section" | "palette-field";

export interface DragItem {
  type: DragItemType;
  id: string;
  fieldType?: FieldType;
  sourceIndex?: number;
  sourceSectionId?: string;
}

export interface DropResult {
  targetIndex: number;
  targetSectionId?: string;
}

// ============================================================================
// CODE GENERATION OUTPUT
// ============================================================================

export interface GeneratedFile {
  /** File name */
  filename: string;
  /** File content */
  content: string;
  /** File type for syntax highlighting */
  type: "tsx" | "ts" | "jsx" | "js" | "css" | "md" | "json";
}

export interface GeneratedOutput {
  /** Main component file */
  component: GeneratedFile;
  /** Types file (if TypeScript) */
  types?: GeneratedFile;
  /** Styles file (if CSS) */
  styles?: GeneratedFile;
  /** README file */
  readme?: GeneratedFile;
  /** Package.json dependencies */
  dependencies: Record<string, string>;
}

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

export const ValidationRuleSchema = z.object({
  type: z.enum([
    "required",
    "minLength",
    "maxLength",
    "min",
    "max",
    "pattern",
    "email",
    "url",
    "custom",
  ]),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  message: z.string(),
  customFn: z.string().optional(),
});

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "email",
    "password",
    "number",
    "textarea",
    "select",
    "checkbox",
    "radio",
    "date",
    "file",
    "signature",
    "hidden",
  ]),
  label: z.string(),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  name: z.string(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  validation: z.array(ValidationRuleSchema),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        disabled: z.boolean().optional(),
      })
    )
    .optional(),
  colSpan: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  sectionId: z.string().optional(),
  order: z.number(),
});

export const FormSchemaValidator = z.object({
  version: z.string(),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      order: z.number(),
      columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
      collapsible: z.boolean().optional(),
      defaultCollapsed: z.boolean().optional(),
    })
  ),
  fields: z.array(FormFieldSchema),
  settings: z.object({
    submitButtonText: z.string(),
    resetButtonText: z.string().optional(),
    showLabels: z.boolean(),
    showRequiredAsterisk: z.boolean(),
    layout: z.enum(["single", "wizard"]),
    defaultColumns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    enableValidation: z.boolean(),
    validationTrigger: z.enum(["onChange", "onBlur", "onSubmit"]),
  }),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
