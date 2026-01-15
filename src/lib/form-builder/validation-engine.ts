// Validation Engine
// Evaluates validation rules and generates validation code

import type { FormField, ValidationRule, ValidationRuleType } from "./types";
import { DEFAULT_VALIDATION_MESSAGES } from "./constants";

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  fieldId: string;
  fieldName: string;
  rule: ValidationRuleType;
  message: string;
}

// ============================================================================
// RUNTIME VALIDATION
// ============================================================================

/**
 * Validate a single field value against its rules
 */
export function validateField(
  field: FormField,
  value: unknown
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const rule of field.validation) {
    const error = validateRule(field, value, rule);
    if (error) {
      errors.push(error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all fields in a form
 */
export function validateForm(
  fields: FormField[],
  values: Record<string, unknown>
): ValidationResult {
  const allErrors: ValidationError[] = [];

  for (const field of fields) {
    const value = values[field.name];
    const result = validateField(field, value);
    allErrors.push(...result.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validate a single rule against a value
 */
function validateRule(
  field: FormField,
  value: unknown,
  rule: ValidationRule
): ValidationError | null {
  const stringValue = String(value ?? "");
  const isEmpty = value === undefined || value === null || stringValue === "";

  switch (rule.type) {
    case "required":
      if (isEmpty) {
        return createError(field, rule);
      }
      break;

    case "minLength":
      if (!isEmpty && stringValue.length < Number(rule.value)) {
        return createError(field, rule);
      }
      break;

    case "maxLength":
      if (!isEmpty && stringValue.length > Number(rule.value)) {
        return createError(field, rule);
      }
      break;

    case "min":
      if (!isEmpty && Number(value) < Number(rule.value)) {
        return createError(field, rule);
      }
      break;

    case "max":
      if (!isEmpty && Number(value) > Number(rule.value)) {
        return createError(field, rule);
      }
      break;

    case "pattern":
      if (!isEmpty && rule.value) {
        const regex = new RegExp(String(rule.value));
        if (!regex.test(stringValue)) {
          return createError(field, rule);
        }
      }
      break;

    case "email":
      if (!isEmpty) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return createError(field, rule);
        }
      }
      break;

    case "url":
      if (!isEmpty) {
        try {
          new URL(stringValue);
        } catch {
          return createError(field, rule);
        }
      }
      break;

    case "custom":
      if (!isEmpty && rule.customFn) {
        try {
          // Create a function from the custom validation string
          const customValidator = new Function(
            "value",
            "field",
            `return (${rule.customFn})(value, field);`
          );
          const isValid = customValidator(value, field);
          if (!isValid) {
            return createError(field, rule);
          }
        } catch (e) {
          console.error("Custom validation error:", e);
          return createError(field, rule);
        }
      }
      break;
  }

  return null;
}

/**
 * Create a validation error object
 */
function createError(field: FormField, rule: ValidationRule): ValidationError {
  return {
    fieldId: field.id,
    fieldName: field.name,
    rule: rule.type,
    message: formatMessage(rule),
  };
}

/**
 * Format validation message with value placeholder
 */
function formatMessage(rule: ValidationRule): string {
  let message = rule.message || DEFAULT_VALIDATION_MESSAGES[rule.type] || "Invalid value";
  
  if (rule.value !== undefined) {
    message = message.replace("{value}", String(rule.value));
  }
  
  return message;
}

// ============================================================================
// CODE GENERATION FOR VALIDATION
// ============================================================================

/**
 * Generate validation code for a single field (JavaScript)
 */
export function generateFieldValidationCode(field: FormField): string {
  if (field.validation.length === 0) {
    return "";
  }

  const lines: string[] = [];
  lines.push(`// Validate ${field.name}`);
  lines.push(`const validate_${field.name} = (value) => {`);
  lines.push("  const errors = [];");

  for (const rule of field.validation) {
    const code = generateRuleCode(rule, "value");
    if (code) {
      lines.push("");
      lines.push(`  // ${rule.type}`);
      lines.push("  " + code.replace(/\n/g, "\n  "));
    }
  }

  lines.push("");
  lines.push("  return errors;");
  lines.push("};");

  return lines.join("\n");
}

/**
 * Generate validation code for a single rule
 */
function generateRuleCode(rule: ValidationRule, valueVar: string): string {
  const message = JSON.stringify(formatMessage(rule));

  switch (rule.type) {
    case "required":
      return `if (${valueVar} === undefined || ${valueVar} === null || ${valueVar} === '') {
    errors.push(${message});
  }`;

    case "minLength":
      return `if (${valueVar} && String(${valueVar}).length < ${rule.value}) {
    errors.push(${message});
  }`;

    case "maxLength":
      return `if (${valueVar} && String(${valueVar}).length > ${rule.value}) {
    errors.push(${message});
  }`;

    case "min":
      return `if (${valueVar} !== '' && Number(${valueVar}) < ${rule.value}) {
    errors.push(${message});
  }`;

    case "max":
      return `if (${valueVar} !== '' && Number(${valueVar}) > ${rule.value}) {
    errors.push(${message});
  }`;

    case "pattern":
      return `if (${valueVar} && !/${rule.value}/.test(String(${valueVar}))) {
    errors.push(${message});
  }`;

    case "email":
      return `if (${valueVar} && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(${valueVar}))) {
    errors.push(${message});
  }`;

    case "url":
      return `if (${valueVar}) {
    try {
      new URL(String(${valueVar}));
    } catch {
      errors.push(${message});
    }
  }`;

    case "custom":
      if (rule.customFn) {
        return `if (${valueVar}) {
    const customValidator = ${rule.customFn};
    if (!customValidator(${valueVar})) {
      errors.push(${message});
    }
  }`;
      }
      return "";

    default:
      return "";
  }
}

/**
 * Generate complete validation function for all fields
 */
export function generateFormValidationCode(fields: FormField[]): string {
  const lines: string[] = [];
  
  lines.push("/**");
  lines.push(" * Validate all form fields");
  lines.push(" * @param {Object} values - Form values");
  lines.push(" * @returns {{ isValid: boolean, errors: Object }}");
  lines.push(" */");
  lines.push("const validateForm = (values) => {");
  lines.push("  const errors = {};");
  lines.push("");

  for (const field of fields) {
    if (field.validation.length === 0) continue;

    lines.push(`  // ${field.label}`);
    lines.push(`  const ${field.name}Errors = [];`);
    
    for (const rule of field.validation) {
      const errorMsg = JSON.stringify(formatMessage(rule));
      
      switch (rule.type) {
        case "required":
          lines.push(`  if (!values.${field.name}) ${field.name}Errors.push(${errorMsg});`);
          break;
        case "minLength":
          lines.push(`  if (values.${field.name} && values.${field.name}.length < ${rule.value}) ${field.name}Errors.push(${errorMsg});`);
          break;
        case "maxLength":
          lines.push(`  if (values.${field.name} && values.${field.name}.length > ${rule.value}) ${field.name}Errors.push(${errorMsg});`);
          break;
        case "email":
          lines.push(`  if (values.${field.name} && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.${field.name})) ${field.name}Errors.push(${errorMsg});`);
          break;
        case "pattern":
          lines.push(`  if (values.${field.name} && !/${rule.value}/.test(values.${field.name})) ${field.name}Errors.push(${errorMsg});`);
          break;
      }
    }
    
    lines.push(`  if (${field.name}Errors.length > 0) errors.${field.name} = ${field.name}Errors;`);
    lines.push("");
  }

  lines.push("  return {");
  lines.push("    isValid: Object.keys(errors).length === 0,");
  lines.push("    errors");
  lines.push("  };");
  lines.push("};");

  return lines.join("\n");
}

/**
 * Generate HTML5 validation attributes for a field
 */
export function generateHtml5Attributes(field: FormField): Record<string, string | number | boolean> {
  const attrs: Record<string, string | number | boolean> = {};

  for (const rule of field.validation) {
    switch (rule.type) {
      case "required":
        attrs.required = true;
        break;
      case "minLength":
        attrs.minLength = Number(rule.value);
        break;
      case "maxLength":
        attrs.maxLength = Number(rule.value);
        break;
      case "min":
        attrs.min = Number(rule.value);
        break;
      case "max":
        attrs.max = Number(rule.value);
        break;
      case "pattern":
        attrs.pattern = String(rule.value);
        break;
    }
  }

  return attrs;
}
