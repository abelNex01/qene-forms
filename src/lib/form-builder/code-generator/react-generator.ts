// React Component Generator
// Generates React form components in JavaScript and TypeScript

import type { FormSchema, FormField, FormSection, ExportConfig } from "../types";
import { generateHtml5Attributes } from "../validation-engine";
import { generateConditionalCode } from "../conditional-engine";
import { FIELD_TYPE_CONFIGS } from "../constants";

// ============================================================================
// JAVASCRIPT GENERATOR
// ============================================================================

/**
 * Generate a React component in JavaScript
 */
export function generateReactComponent(
  schema: FormSchema,
  config: ExportConfig
): string {
  const lines: string[] = [];
  const componentName = config.componentName;

  // Imports
  lines.push(`import { useState } from 'react';`);
  if (config.styling === "css") {
    lines.push(`import './${componentName}.css';`);
  }
  lines.push("");

  // Initial values
  lines.push("// Initial form values");
  lines.push(`const initialValues = ${generateInitialValues(schema.fields)};`);
  lines.push("");

  // Component
  lines.push(`export function ${componentName}({ onSubmit }) {`);
  lines.push("  const [values, setValues] = useState(initialValues);");
  lines.push("  const [errors, setErrors] = useState({});");
  lines.push("  const [touched, setTouched] = useState({});");
  lines.push("");

  // Handler functions
  lines.push("  const handleChange = (e) => {");
  lines.push("    const { name, value, type, checked } = e.target;");
  lines.push("    setValues(prev => ({");
  lines.push("      ...prev,");
  lines.push("      [name]: type === 'checkbox' ? checked : value");
  lines.push("    }));");
  lines.push("  };");
  lines.push("");

  lines.push("  const handleBlur = (e) => {");
  lines.push("    const { name } = e.target;");
  lines.push("    setTouched(prev => ({ ...prev, [name]: true }));");
  if (config.validation !== "none") {
    lines.push("    validateField(name, values[name]);");
  }
  lines.push("  };");
  lines.push("");

  // Validation function
  if (config.validation === "native" || config.validation === "custom") {
    lines.push(generateValidationFunction(schema.fields));
    lines.push("");
  }

  // Submit handler
  lines.push("  const handleSubmit = (e) => {");
  lines.push("    e.preventDefault();");
  if (config.validation !== "none") {
    lines.push("    const validationErrors = validateAll();");
    lines.push("    if (Object.keys(validationErrors).length > 0) {");
    lines.push("      setErrors(validationErrors);");
    lines.push("      return;");
    lines.push("    }");
  }
  lines.push("    onSubmit?.(values);");
  lines.push("  };");
  lines.push("");

  // Reset handler
  if (schema.settings.resetButtonText) {
    lines.push("  const handleReset = () => {");
    lines.push("    setValues(initialValues);");
    lines.push("    setErrors({});");
    lines.push("    setTouched({});");
    lines.push("  };");
    lines.push("");
  }

  // Render
  lines.push("  return (");
  lines.push(`    <form onSubmit={handleSubmit} className="${getFormClassName(config)}">`);

  // Render sections and fields
  const sortedSections = [...schema.sections].sort((a, b) => a.order - b.order);
  for (const section of sortedSections) {
    lines.push(...generateSectionJSX(section, schema.fields, config, "      "));
  }

  // Submit/Reset buttons
  lines.push(`      <div className="${getButtonContainerClass(config)}">`);
  lines.push(`        <button type="submit" className="${getSubmitButtonClass(config)}">`);
  lines.push(`          ${schema.settings.submitButtonText}`);
  lines.push("        </button>");
  if (schema.settings.resetButtonText) {
    lines.push(`        <button type="button" onClick={handleReset} className="${getResetButtonClass(config)}">`);
    lines.push(`          ${schema.settings.resetButtonText}`);
    lines.push("        </button>");
  }
  lines.push("      </div>");
  lines.push("    </form>");
  lines.push("  );");
  lines.push("}");
  lines.push("");
  lines.push(`export default ${componentName};`);

  return lines.join("\n");
}

// ============================================================================
// TYPESCRIPT GENERATOR
// ============================================================================

/**
 * Generate a React component in TypeScript
 */
export function generateReactComponentTS(
  schema: FormSchema,
  config: ExportConfig
): string {
  const lines: string[] = [];
  const componentName = config.componentName;

  // Imports
  lines.push(`import { useState, FormEvent, ChangeEvent } from 'react';`);
  if (config.includeTypes) {
    lines.push(`import type { ${componentName}Props, ${componentName}Values, ${componentName}Errors } from './${componentName}.types';`);
  }
  if (config.styling === "css") {
    lines.push(`import './${componentName}.css';`);
  }
  lines.push("");

  // Types if not in separate file
  if (!config.includeTypes) {
    lines.push(generateInlineTypes(schema, componentName));
    lines.push("");
  }

  // Initial values
  lines.push("// Initial form values");
  lines.push(`const initialValues: ${componentName}Values = ${generateInitialValues(schema.fields)};`);
  lines.push("");

  // Component
  lines.push(`export function ${componentName}({ onSubmit }: ${componentName}Props) {`);
  lines.push(`  const [values, setValues] = useState<${componentName}Values>(initialValues);`);
  lines.push(`  const [errors, setErrors] = useState<${componentName}Errors>({});`);
  lines.push("  const [touched, setTouched] = useState<Record<string, boolean>>({});");
  lines.push("");

  // Handler functions
  lines.push("  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {");
  lines.push("    const { name, value, type } = e.target;");
  lines.push("    const checked = (e.target as HTMLInputElement).checked;");
  lines.push("    setValues(prev => ({");
  lines.push("      ...prev,");
  lines.push("      [name]: type === 'checkbox' ? checked : value");
  lines.push("    }));");
  lines.push("  };");
  lines.push("");

  lines.push("  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {");
  lines.push("    const { name } = e.target;");
  lines.push("    setTouched(prev => ({ ...prev, [name]: true }));");
  if (config.validation !== "none") {
    lines.push("    validateField(name as keyof typeof values, values[name as keyof typeof values]);");
  }
  lines.push("  };");
  lines.push("");

  // Validation function
  if (config.validation === "native" || config.validation === "custom") {
    lines.push(generateValidationFunctionTS(schema.fields, componentName));
    lines.push("");
  }

  // Submit handler
  lines.push("  const handleSubmit = (e: FormEvent) => {");
  lines.push("    e.preventDefault();");
  if (config.validation !== "none") {
    lines.push("    const validationErrors = validateAll();");
    lines.push("    if (Object.keys(validationErrors).length > 0) {");
    lines.push("      setErrors(validationErrors);");
    lines.push("      return;");
    lines.push("    }");
  }
  lines.push("    onSubmit?.(values);");
  lines.push("  };");
  lines.push("");

  // Reset handler
  if (schema.settings.resetButtonText) {
    lines.push("  const handleReset = () => {");
    lines.push("    setValues(initialValues);");
    lines.push("    setErrors({});");
    lines.push("    setTouched({});");
    lines.push("  };");
    lines.push("");
  }

  // Render
  lines.push("  return (");
  lines.push(`    <form onSubmit={handleSubmit} className="${getFormClassName(config)}">`);

  // Render sections and fields
  const sortedSections = [...schema.sections].sort((a, b) => a.order - b.order);
  for (const section of sortedSections) {
    lines.push(...generateSectionJSX(section, schema.fields, config, "      "));
  }

  // Submit/Reset buttons
  lines.push(`      <div className="${getButtonContainerClass(config)}">`);
  lines.push(`        <button type="submit" className="${getSubmitButtonClass(config)}">`);
  lines.push(`          ${schema.settings.submitButtonText}`);
  lines.push("        </button>");
  if (schema.settings.resetButtonText) {
    lines.push(`        <button type="button" onClick={handleReset} className="${getResetButtonClass(config)}">`);
    lines.push(`          ${schema.settings.resetButtonText}`);
    lines.push("        </button>");
  }
  lines.push("      </div>");
  lines.push("    </form>");
  lines.push("  );");
  lines.push("}");
  lines.push("");
  lines.push(`export default ${componentName};`);

  return lines.join("\n");
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateInitialValues(fields: FormField[]): string {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    } else {
      switch (field.type) {
        case "checkbox":
          values[field.name] = false;
          break;
        case "number":
          values[field.name] = "";
          break;
        default:
          values[field.name] = "";
      }
    }
  }
  return JSON.stringify(values, null, 2).replace(/\n/g, "\n");
}

function generateSectionJSX(
  section: FormSection,
  allFields: FormField[],
  config: ExportConfig,
  indent: string
): string[] {
  const lines: string[] = [];
  const sectionFields = allFields
    .filter((f) => f.sectionId === section.id)
    .sort((a, b) => a.order - b.order);

  if (sectionFields.length === 0) return lines;

  // Section wrapper
  if (section.title) {
    lines.push(`${indent}<fieldset className="${getSectionClass(config)}">`);
    lines.push(`${indent}  <legend className="${getSectionTitleClass(config)}">${section.title}</legend>`);
    if (section.description) {
      lines.push(`${indent}  <p className="${getSectionDescClass(config)}">${section.description}</p>`);
    }
  }

  // Grid container
  const gridClass = getGridClass(section.columns, config);
  lines.push(`${indent}  <div className="${gridClass}">`);

  // Fields
  const fieldNameMap = new Map(allFields.map((f) => [f.id, f.name]));
  for (const field of sectionFields) {
    lines.push(...generateFieldJSX(field, fieldNameMap, config, `${indent}    `));
  }

  lines.push(`${indent}  </div>`);
  if (section.title) {
    lines.push(`${indent}</fieldset>`);
  }

  return lines;
}

function generateFieldJSX(
  field: FormField,
  fieldNameMap: Map<string, string>,
  config: ExportConfig,
  indent: string
): string[] {
  const lines: string[] = [];
  const attrs = generateHtml5Attributes(field);
  const hasConditional = field.conditionalLogic && field.conditionalLogic.rules.length > 0;

  // Get column span class
  const colSpanClass = getColSpanClass(field.colSpan || 1, config);
  
  // Wrapper with conditional rendering
  if (hasConditional) {
    const condition = generateConditionalCode(field, fieldNameMap);
    lines.push(`${indent}{${condition} && (`);
  }

  lines.push(`${indent}<div className="${getFieldWrapperClass(config)} ${colSpanClass}">`);
  
  // Label
  if (field.label) {
    const isRequired = field.validation.some((v) => v.type === "required");
    lines.push(`${indent}  <label htmlFor="${field.name}" className="${getLabelClass(config)}">`);
    lines.push(`${indent}    ${field.label}`);
    if (isRequired) {
      lines.push(`${indent}    <span className="${getRequiredClass(config)}">*</span>`);
    }
    lines.push(`${indent}  </label>`);
  }

  // Input element
  lines.push(...generateInputElement(field, attrs, config, `${indent}  `));

  // Helper text
  if (field.helperText) {
    lines.push(`${indent}  <p className="${getHelperClass(config)}">${field.helperText}</p>`);
  }

  // Error message
  lines.push(`${indent}  {touched.${field.name} && errors.${field.name} && (`);
  lines.push(`${indent}    <p className="${getErrorClass(config)}">{errors.${field.name}}</p>`);
  lines.push(`${indent}  )}`);

  lines.push(`${indent}</div>`);

  if (hasConditional) {
    lines.push(`${indent})}`);
  }

  return lines;
}

function generateInputElement(
  field: FormField,
  attrs: Record<string, string | number | boolean>,
  config: ExportConfig,
  indent: string
): string[] {
  const lines: string[] = [];
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : "";
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(" ");

  const inputClass = getInputClass(config);
  const commonAttrs = `
    id="${field.name}"
    name="${field.name}"
    value={values.${field.name}}
    onChange={handleChange}
    onBlur={handleBlur}
    className="${inputClass}"
    ${field.placeholder ? `placeholder="${field.placeholder}"` : ""}
    ${field.disabled ? "disabled" : ""}
    ${field.readOnly ? "readOnly" : ""}
    ${attrsStr}
  `.trim().replace(/\s+/g, " ");

  switch (field.type) {
    case "textarea":
      lines.push(`${indent}<textarea ${commonAttrs} />`);
      break;

    case "select":
      lines.push(`${indent}<select ${commonAttrs}>`);
      lines.push(`${indent}  <option value="">${field.placeholder || "Select..."}</option>`);
      for (const option of field.options || []) {
        lines.push(`${indent}  <option value="${option.value}" ${option.disabled ? "disabled" : ""}>${option.label}</option>`);
      }
      lines.push(`${indent}</select>`);
      break;

    case "checkbox":
      lines.push(`${indent}<input type="checkbox" ${commonAttrs.replace("value={values.", "checked={values.")} />`);
      break;

    case "radio":
      for (const option of field.options || []) {
        lines.push(`${indent}<label className="${getRadioLabelClass(config)}">`);
        lines.push(`${indent}  <input`);
        lines.push(`${indent}    type="radio"`);
        lines.push(`${indent}    name="${field.name}"`);
        lines.push(`${indent}    value="${option.value}"`);
        lines.push(`${indent}    checked={values.${field.name} === "${option.value}"}`);
        lines.push(`${indent}    onChange={handleChange}`);
        lines.push(`${indent}    className="${getRadioInputClass(config)}"`);
        lines.push(`${indent}  />`);
        lines.push(`${indent}  ${option.label}`);
        lines.push(`${indent}</label>`);
      }
      break;

    default:
      const inputType = field.type === "email" ? "email" : 
                        field.type === "password" ? "password" :
                        field.type === "number" ? "number" :
                        field.type === "date" ? "date" :
                        field.type === "file" ? "file" : "text";
      lines.push(`${indent}<input type="${inputType}" ${commonAttrs} />`);
  }

  return lines;
}

function generateValidationFunction(fields: FormField[]): string {
  const lines: string[] = [];
  lines.push("  const validateField = (name, value) => {");
  lines.push("    let error = '';");
  lines.push("    switch (name) {");

  for (const field of fields) {
    if (field.validation.length === 0) continue;
    lines.push(`      case '${field.name}':`);
    for (const rule of field.validation) {
      switch (rule.type) {
        case "required":
          lines.push(`        if (!value) error = '${rule.message}';`);
          break;
        case "email":
          lines.push(`        if (value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) error = '${rule.message}';`);
          break;
        case "minLength":
          lines.push(`        if (value && value.length < ${rule.value}) error = '${rule.message}';`);
          break;
        case "maxLength":
          lines.push(`        if (value && value.length > ${rule.value}) error = '${rule.message}';`);
          break;
      }
    }
    lines.push("        break;");
  }

  lines.push("    }");
  lines.push("    if (error) setErrors(prev => ({ ...prev, [name]: error }));");
  lines.push("    else setErrors(prev => { const { [name]: _, ...rest } = prev; return rest; });");
  lines.push("  };");
  lines.push("");
  lines.push("  const validateAll = () => {");
  lines.push("    const newErrors = {};");
  for (const field of fields) {
    if (field.validation.some((v) => v.type === "required")) {
      lines.push(`    if (!values.${field.name}) newErrors.${field.name} = 'This field is required';`);
    }
  }
  lines.push("    return newErrors;");
  lines.push("  };");
  return lines.join("\n");
}

function generateValidationFunctionTS(fields: FormField[], componentName: string): string {
  return generateValidationFunction(fields)
    .replace("const validateField = (name, value)", `const validateField = (name: keyof ${componentName}Values, value: unknown)`)
    .replace("const validateAll = ()", `const validateAll = (): ${componentName}Errors`);
}

function generateInlineTypes(schema: FormSchema, componentName: string): string {
  const lines: string[] = [];
  lines.push(`interface ${componentName}Values {`);
  for (const field of schema.fields) {
    const type = field.type === "checkbox" ? "boolean" : "string";
    lines.push(`  ${field.name}: ${type};`);
  }
  lines.push("}");
  lines.push("");
  lines.push(`interface ${componentName}Errors {`);
  for (const field of schema.fields) {
    lines.push(`  ${field.name}?: string;`);
  }
  lines.push("}");
  lines.push("");
  lines.push(`interface ${componentName}Props {`);
  lines.push(`  onSubmit?: (values: ${componentName}Values) => void;`);
  lines.push("}");
  return lines.join("\n");
}

// ============================================================================
// CSS CLASS GENERATORS
// ============================================================================

function getFormClassName(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "space-y-6";
  }
  return `${config.componentName.toLowerCase()}-form`;
}

function getSectionClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "border border-gray-200 rounded-lg p-4";
  }
  return "form-section";
}

function getSectionTitleClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "text-lg font-semibold text-gray-900 mb-2";
  }
  return "form-section-title";
}

function getSectionDescClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "text-sm text-gray-500 mb-4";
  }
  return "form-section-desc";
}

function getGridClass(columns: number, config: ExportConfig): string {
  if (config.styling === "tailwind") {
    const colClasses: Record<number, string> = {
      1: "grid grid-cols-1 gap-4",
      2: "grid grid-cols-1 md:grid-cols-2 gap-4",
      3: "grid grid-cols-1 md:grid-cols-3 gap-4",
      4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    };
    return colClasses[columns] || colClasses[1];
  }
  return `form-grid form-grid-${columns}`;
}

function getColSpanClass(colSpan: number, config: ExportConfig): string {
  if (config.styling === "tailwind") {
    const spanClasses: Record<number, string> = {
      1: "",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4 lg:col-span-4",
    };
    return spanClasses[colSpan] || "";
  }
  return colSpan > 1 ? `col-span-${colSpan}` : "";
}

function getFieldWrapperClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "space-y-1";
  }
  return "form-field";
}

function getLabelClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "block text-sm font-medium text-gray-700";
  }
  return "form-label";
}

function getRequiredClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "text-red-500 ml-1";
  }
  return "form-required";
}

function getInputClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  }
  return "form-input";
}

function getHelperClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "text-sm text-gray-500";
  }
  return "form-helper";
}

function getErrorClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "text-sm text-red-600";
  }
  return "form-error";
}

function getRadioLabelClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "flex items-center space-x-2 cursor-pointer";
  }
  return "form-radio-label";
}

function getRadioInputClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "h-4 w-4 text-blue-600";
  }
  return "form-radio-input";
}

function getButtonContainerClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "flex gap-3 pt-4";
  }
  return "form-buttons";
}

function getSubmitButtonClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  }
  return "form-button form-button-submit";
}

function getResetButtonClass(config: ExportConfig): string {
  if (config.styling === "tailwind") {
    return "px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";
  }
  return "form-button form-button-reset";
}
