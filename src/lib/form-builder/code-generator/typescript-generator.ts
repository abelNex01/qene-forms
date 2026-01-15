// TypeScript Type Generator
// Generates TypeScript type definitions for forms

import type { FormSchema, FormField } from "../types";

/**
 * Generate TypeScript type definitions for a form
 */
export function generateTypeDefinitions(
  schema: FormSchema,
  componentName: string
): string {
  const lines: string[] = [];

  // Header
  lines.push("/**");
  lines.push(` * Type definitions for ${componentName}`);
  lines.push(` * Generated from form schema: ${schema.name}`);
  lines.push(` * @generated`);
  lines.push(" */");
  lines.push("");

  // Form values type
  lines.push(`export interface ${componentName}Values {`);
  for (const field of schema.fields) {
    const typeStr = getFieldTypeString(field);
    const optional = !field.validation.some((v) => v.type === "required");
    const comment = field.helperText ? ` // ${field.helperText}` : "";
    lines.push(`  ${field.name}${optional ? "?" : ""}: ${typeStr};${comment}`);
  }
  lines.push("}");
  lines.push("");

  // Errors type
  lines.push(`export interface ${componentName}Errors {`);
  for (const field of schema.fields) {
    lines.push(`  ${field.name}?: string;`);
  }
  lines.push("}");
  lines.push("");

  // Touched type
  lines.push(`export interface ${componentName}Touched {`);
  for (const field of schema.fields) {
    lines.push(`  ${field.name}?: boolean;`);
  }
  lines.push("}");
  lines.push("");

  // Props type
  lines.push(`export interface ${componentName}Props {`);
  lines.push("  /** Callback when form is submitted with valid values */");
  lines.push(`  onSubmit?: (values: ${componentName}Values) => void;`);
  lines.push("  /** Callback when form values change */");
  lines.push(`  onChange?: (values: ${componentName}Values) => void;`);
  lines.push("  /** Initial form values */");
  lines.push(`  initialValues?: Partial<${componentName}Values>;`);
  lines.push("  /** Whether the form is disabled */");
  lines.push("  disabled?: boolean;`");
  lines.push("  /** Whether the form is in loading state */");
  lines.push("  loading?: boolean;");
  lines.push("}");
  lines.push("");

  // Field names enum
  lines.push(`export enum ${componentName}FieldNames {`);
  for (const field of schema.fields) {
    const enumKey = field.name.toUpperCase().replace(/[^A-Z0-9]/g, "_");
    lines.push(`  ${enumKey} = "${field.name}",`);
  }
  lines.push("}");
  lines.push("");

  // Select/Radio options types
  const fieldsWithOptions = schema.fields.filter(
    (f) => f.options && f.options.length > 0
  );
  if (fieldsWithOptions.length > 0) {
    lines.push("// Option types for select/radio fields");
    for (const field of fieldsWithOptions) {
      const optionValues = field.options!.map((o) => `"${o.value}"`).join(" | ");
      const typeName = `${componentName}${capitalize(field.name)}Option`;
      lines.push(`export type ${typeName} = ${optionValues};`);
    }
    lines.push("");
  }

  // Validation schema type (for Zod/Yup integration)
  lines.push("// Validation constants");
  lines.push(`export const ${componentName}ValidationConfig = {`);
  for (const field of schema.fields) {
    if (field.validation.length === 0) continue;
    lines.push(`  ${field.name}: {`);
    for (const rule of field.validation) {
      switch (rule.type) {
        case "required":
          lines.push(`    required: true,`);
          break;
        case "minLength":
          lines.push(`    minLength: ${rule.value},`);
          break;
        case "maxLength":
          lines.push(`    maxLength: ${rule.value},`);
          break;
        case "min":
          lines.push(`    min: ${rule.value},`);
          break;
        case "max":
          lines.push(`    max: ${rule.value},`);
          break;
        case "pattern":
          lines.push(`    pattern: /${rule.value}/,`);
          break;
        case "email":
          lines.push(`    email: true,`);
          break;
      }
    }
    lines.push(`  },`);
  }
  lines.push("} as const;");
  lines.push("");

  // Default export
  lines.push(`export type { ${componentName}Values as FormValues };`);

  return lines.join("\n");
}

/**
 * Get TypeScript type string for a field
 */
function getFieldTypeString(field: FormField): string {
  switch (field.type) {
    case "checkbox":
      // Single checkbox = boolean, multiple checkboxes = string[]
      return field.options && field.options.length > 1 ? "string[]" : "boolean";
      
    case "number":
      return "number | string"; // Form inputs return strings
      
    case "date":
      return "string"; // HTML date inputs return ISO strings
      
    case "file":
      return "File | null";
      
    case "select":
    case "radio":
      if (field.options && field.options.length > 0) {
        return field.options.map((o) => `"${o.value}"`).join(" | ") + " | \"\"";
      }
      return "string";
      
    case "signature":
      return "string"; // Base64 data URL
      
    default:
      return "string";
  }
}

/**
 * Generate Zod schema for form validation
 */
export function generateZodSchema(
  schema: FormSchema,
  componentName: string
): string {
  const lines: string[] = [];

  lines.push(`import { z } from 'zod';`);
  lines.push("");
  lines.push(`export const ${componentName}Schema = z.object({`);

  for (const field of schema.fields) {
    const zodType = generateZodFieldType(field);
    lines.push(`  ${field.name}: ${zodType},`);
  }

  lines.push("});");
  lines.push("");
  lines.push(`export type ${componentName}Values = z.infer<typeof ${componentName}Schema>;`);

  return lines.join("\n");
}

/**
 * Generate Zod type for a single field
 */
function generateZodFieldType(field: FormField): string {
  let zodChain: string[] = [];

  // Base type
  switch (field.type) {
    case "email":
      zodChain.push("z.string()");
      zodChain.push(".email()");
      break;
    case "number":
      zodChain.push("z.coerce.number()");
      break;
    case "checkbox":
      zodChain.push("z.boolean()");
      break;
    case "date":
      zodChain.push("z.string()");
      break;
    default:
      zodChain.push("z.string()");
  }

  // Add validation rules
  for (const rule of field.validation) {
    switch (rule.type) {
      case "minLength":
        zodChain.push(`.min(${rule.value}, "${rule.message}")`);
        break;
      case "maxLength":
        zodChain.push(`.max(${rule.value}, "${rule.message}")`);
        break;
      case "min":
        zodChain.push(`.min(${rule.value}, "${rule.message}")`);
        break;
      case "max":
        zodChain.push(`.max(${rule.value}, "${rule.message}")`);
        break;
      case "pattern":
        zodChain.push(`.regex(/${rule.value}/, "${rule.message}")`);
        break;
      case "url":
        zodChain.push(`.url("${rule.message}")`);
        break;
    }
  }

  // Make optional if not required
  const isRequired = field.validation.some((v) => v.type === "required");
  if (!isRequired) {
    zodChain.push(".optional()");
  }

  return zodChain.join("");
}

/**
 * Generate Yup schema for form validation
 */
export function generateYupSchema(
  schema: FormSchema,
  componentName: string
): string {
  const lines: string[] = [];

  lines.push(`import * as yup from 'yup';`);
  lines.push("");
  lines.push(`export const ${componentName}Schema = yup.object({`);

  for (const field of schema.fields) {
    const yupType = generateYupFieldType(field);
    lines.push(`  ${field.name}: ${yupType},`);
  }

  lines.push("});");
  lines.push("");
  lines.push(`export type ${componentName}Values = yup.InferType<typeof ${componentName}Schema>;`);

  return lines.join("\n");
}

/**
 * Generate Yup type for a single field
 */
function generateYupFieldType(field: FormField): string {
  let yupChain: string[] = [];

  // Base type
  switch (field.type) {
    case "email":
      yupChain.push("yup.string()");
      yupChain.push(".email()");
      break;
    case "number":
      yupChain.push("yup.number()");
      break;
    case "checkbox":
      yupChain.push("yup.boolean()");
      break;
    default:
      yupChain.push("yup.string()");
  }

  // Add validation rules
  for (const rule of field.validation) {
    switch (rule.type) {
      case "required":
        yupChain.push(`.required("${rule.message}")`);
        break;
      case "minLength":
        yupChain.push(`.min(${rule.value}, "${rule.message}")`);
        break;
      case "maxLength":
        yupChain.push(`.max(${rule.value}, "${rule.message}")`);
        break;
      case "min":
        yupChain.push(`.min(${rule.value}, "${rule.message}")`);
        break;
      case "max":
        yupChain.push(`.max(${rule.value}, "${rule.message}")`);
        break;
      case "pattern":
        yupChain.push(`.matches(/${rule.value}/, "${rule.message}")`);
        break;
      case "url":
        yupChain.push(`.url("${rule.message}")`);
        break;
    }
  }

  return yupChain.join("");
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
