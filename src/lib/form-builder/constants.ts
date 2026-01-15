// Form Builder Constants
// Default configurations and field type definitions

import type { FieldType, FormSchema, FormSettings, ExportConfig, FormField, FormSection } from "./types";

// ============================================================================
// FIELD TYPE CONFIGURATIONS
// ============================================================================

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  defaultPlaceholder: string;
  supportsOptions: boolean;
  supportsValidation: string[];
  defaultValidation: string[];
}

export const FIELD_TYPE_CONFIGS: Record<FieldType, FieldTypeConfig> = {
  text: {
    type: "text",
    label: "Text Input",
    icon: "Type",
    description: "Single line text input",
    defaultPlaceholder: "Enter text...",
    supportsOptions: false,
    supportsValidation: ["required", "minLength", "maxLength", "pattern"],
    defaultValidation: [],
  },
  email: {
    type: "email",
    label: "Email",
    icon: "Mail",
    description: "Email address input with validation",
    defaultPlaceholder: "email@example.com",
    supportsOptions: false,
    supportsValidation: ["required", "email", "pattern"],
    defaultValidation: ["email"],
  },
  password: {
    type: "password",
    label: "Password",
    icon: "Lock",
    description: "Secure password input",
    defaultPlaceholder: "Enter password...",
    supportsOptions: false,
    supportsValidation: ["required", "minLength", "maxLength", "pattern"],
    defaultValidation: [],
  },
  number: {
    type: "number",
    label: "Number",
    icon: "Hash",
    description: "Numeric input with min/max",
    defaultPlaceholder: "0",
    supportsOptions: false,
    supportsValidation: ["required", "min", "max"],
    defaultValidation: [],
  },
  textarea: {
    type: "textarea",
    label: "Text Area",
    icon: "AlignLeft",
    description: "Multi-line text input",
    defaultPlaceholder: "Enter your message...",
    supportsOptions: false,
    supportsValidation: ["required", "minLength", "maxLength"],
    defaultValidation: [],
  },
  select: {
    type: "select",
    label: "Dropdown",
    icon: "ChevronDown",
    description: "Dropdown selection",
    defaultPlaceholder: "Select an option...",
    supportsOptions: true,
    supportsValidation: ["required"],
    defaultValidation: [],
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: "CheckSquare",
    description: "Single or multiple checkboxes",
    defaultPlaceholder: "",
    supportsOptions: true,
    supportsValidation: ["required"],
    defaultValidation: [],
  },
  radio: {
    type: "radio",
    label: "Radio Group",
    icon: "Circle",
    description: "Single selection from options",
    defaultPlaceholder: "",
    supportsOptions: true,
    supportsValidation: ["required"],
    defaultValidation: [],
  },
  date: {
    type: "date",
    label: "Date Picker",
    icon: "Calendar",
    description: "Date selection input",
    defaultPlaceholder: "Select date...",
    supportsOptions: false,
    supportsValidation: ["required", "min", "max"],
    defaultValidation: [],
  },
  file: {
    type: "file",
    label: "File Upload",
    icon: "Upload",
    description: "File upload with type restrictions",
    defaultPlaceholder: "Choose file...",
    supportsOptions: false,
    supportsValidation: ["required"],
    defaultValidation: [],
  },
  signature: {
    type: "signature",
    label: "Signature",
    icon: "Pen",
    description: "Digital signature field",
    defaultPlaceholder: "",
    supportsOptions: false,
    supportsValidation: ["required"],
    defaultValidation: [],
  },
  hidden: {
    type: "hidden",
    label: "Hidden Field",
    icon: "EyeOff",
    description: "Hidden form field",
    defaultPlaceholder: "",
    supportsOptions: false,
    supportsValidation: [],
    defaultValidation: [],
  },
};

// ============================================================================
// FIELD PALETTE CATEGORIES
// ============================================================================

export interface FieldCategory {
  id: string;
  label: string;
  fields: FieldType[];
}

export const FIELD_CATEGORIES: FieldCategory[] = [
  {
    id: "basic",
    label: "Basic Fields",
    fields: ["text", "email", "password", "number", "textarea"],
  },
  {
    id: "selection",
    label: "Selection Fields",
    fields: ["select", "checkbox", "radio"],
  },
  {
    id: "advanced",
    label: "Advanced Fields",
    fields: ["date", "file", "signature"],
  },
  {
    id: "utility",
    label: "Utility",
    fields: ["hidden"],
  },
];

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_FORM_SETTINGS: FormSettings = {
  submitButtonText: "Submit",
  resetButtonText: "Reset",
  showLabels: true,
  showRequiredAsterisk: true,
  layout: "single",
  defaultColumns: 1,
  enableValidation: true,
  validationTrigger: "onBlur",
};

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  language: "typescript",
  styling: "tailwind",
  validation: "native",
  componentName: "GeneratedForm",
  includeTypes: true,
  includeReadme: true,
  includeCssFile: false,
  useReactHookForm: false,
  useFormik: false,
};

export const DEFAULT_SECTION: Omit<FormSection, "id"> = {
  title: "Section",
  description: "",
  order: 0,
  columns: 1,
  collapsible: false,
  defaultCollapsed: false,
};

// ============================================================================
// SCHEMA DEFAULTS
// ============================================================================

export const CURRENT_SCHEMA_VERSION = "1.0.0";

export function createEmptyFormSchema(name: string = "Untitled Form"): FormSchema {
  const now = new Date().toISOString();
  return {
    version: CURRENT_SCHEMA_VERSION,
    id: crypto.randomUUID(),
    name,
    description: "",
    sections: [
      {
        id: crypto.randomUUID(),
        title: "Default Section",
        description: "",
        order: 0,
        columns: 1,
      },
    ],
    fields: [],
    settings: { ...DEFAULT_FORM_SETTINGS },
    metadata: {
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function createDefaultField(
  type: FieldType,
  order: number,
  sectionId?: string
): FormField {
  const config = FIELD_TYPE_CONFIGS[type];
  const id = crypto.randomUUID();

  return {
    id,
    type,
    label: config.label,
    placeholder: config.defaultPlaceholder,
    name: `field_${id.slice(0, 8)}`,
    validation: [],
    order,
    sectionId,
    colSpan: 1,
    options: config.supportsOptions
      ? [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ]
      : undefined,
  };
}

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const DEFAULT_VALIDATION_MESSAGES: Record<string, string> = {
  required: "This field is required",
  email: "Please enter a valid email address",
  url: "Please enter a valid URL",
  minLength: "Must be at least {value} characters",
  maxLength: "Must be no more than {value} characters",
  min: "Must be at least {value}",
  max: "Must be no more than {value}",
  pattern: "Please match the requested format",
};

// ============================================================================
// EXPORT TEMPLATES
// ============================================================================

export const EXPORT_LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
] as const;

export const EXPORT_STYLING_OPTIONS = [
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "css", label: "Plain CSS" },
  { value: "none", label: "No Styling" },
] as const;

export const EXPORT_VALIDATION_OPTIONS = [
  { value: "native", label: "Native HTML5" },
  { value: "custom", label: "Custom JavaScript" },
  { value: "zod", label: "Zod Schema" },
  { value: "yup", label: "Yup Schema" },
] as const;

// ============================================================================
// HISTORY SETTINGS
// ============================================================================

export const MAX_HISTORY_SIZE = 50;
export const STORAGE_KEY_TEMPLATES = "form_builder_templates";
export const STORAGE_KEY_RECENT = "form_builder_recent";
