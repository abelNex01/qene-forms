// Field Registry
// Central registry for all field types and their capabilities

import type { FieldType, FieldOption, ValidationRule } from "./types";
import { FIELD_TYPE_CONFIGS, type FieldTypeConfig } from "./constants";

// ============================================================================
// FIELD REGISTRY CLASS
// ============================================================================

class FieldRegistryClass {
  private configs: Map<FieldType, FieldTypeConfig> = new Map();

  constructor() {
    // Initialize with default field configs
    Object.entries(FIELD_TYPE_CONFIGS).forEach(([type, config]) => {
      this.configs.set(type as FieldType, config);
    });
  }

  /**
   * Get configuration for a field type
   */
  getConfig(type: FieldType): FieldTypeConfig | undefined {
    return this.configs.get(type);
  }

  /**
   * Get all registered field types
   */
  getAllTypes(): FieldType[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Get all field configurations
   */
  getAllConfigs(): FieldTypeConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Check if a field type supports options (select, radio, checkbox)
   */
  supportsOptions(type: FieldType): boolean {
    return this.configs.get(type)?.supportsOptions ?? false;
  }

  /**
   * Get supported validation types for a field
   */
  getSupportedValidation(type: FieldType): string[] {
    return this.configs.get(type)?.supportsValidation ?? [];
  }

  /**
   * Check if a validation type is supported for a field type
   */
  isValidationSupported(fieldType: FieldType, validationType: string): boolean {
    const config = this.configs.get(fieldType);
    return config?.supportsValidation.includes(validationType) ?? false;
  }

  /**
   * Register a custom field type
   */
  registerFieldType(config: FieldTypeConfig): void {
    this.configs.set(config.type, config);
  }

  /**
   * Get default options for a field type
   */
  getDefaultOptions(type: FieldType): FieldOption[] {
    if (!this.supportsOptions(type)) {
      return [];
    }
    return [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ];
  }

  /**
   * Get default validation rules for a field type
   */
  getDefaultValidation(type: FieldType): ValidationRule[] {
    const config = this.configs.get(type);
    if (!config) return [];

    return config.defaultValidation.map((validationType) => {
      switch (validationType) {
        case "email":
          return {
            type: "email" as const,
            message: "Please enter a valid email address",
          };
        case "required":
          return {
            type: "required" as const,
            message: "This field is required",
          };
        default:
          return {
            type: validationType as ValidationRule["type"],
            message: `Invalid ${validationType}`,
          };
      }
    });
  }

  /**
   * Get field icon name (Lucide icon)
   */
  getIcon(type: FieldType): string {
    return this.configs.get(type)?.icon ?? "Square";
  }

  /**
   * Get field label
   */
  getLabel(type: FieldType): string {
    return this.configs.get(type)?.label ?? type;
  }

  /**
   * Get field description
   */
  getDescription(type: FieldType): string {
    return this.configs.get(type)?.description ?? "";
  }

  /**
   * Get default placeholder for a field type
   */
  getDefaultPlaceholder(type: FieldType): string {
    return this.configs.get(type)?.defaultPlaceholder ?? "";
  }
}

// Singleton instance
export const FieldRegistry = new FieldRegistryClass();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a field type is a text-based input
 */
export function isTextInput(type: FieldType): boolean {
  return ["text", "email", "password", "textarea", "number"].includes(type);
}

/**
 * Check if a field type is a selection input
 */
export function isSelectionInput(type: FieldType): boolean {
  return ["select", "checkbox", "radio"].includes(type);
}

/**
 * Check if a field type is a special input
 */
export function isSpecialInput(type: FieldType): boolean {
  return ["date", "file", "signature", "hidden"].includes(type);
}

/**
 * Get the HTML input type for a field type
 */
export function getHtmlInputType(type: FieldType): string {
  switch (type) {
    case "text":
      return "text";
    case "email":
      return "email";
    case "password":
      return "password";
    case "number":
      return "number";
    case "date":
      return "date";
    case "file":
      return "file";
    case "hidden":
      return "hidden";
    default:
      return "text";
  }
}

/**
 * Get appropriate input component name for React
 */
export function getReactComponent(type: FieldType): string {
  switch (type) {
    case "textarea":
      return "textarea";
    case "select":
      return "select";
    case "checkbox":
      return "input"; // with type="checkbox"
    case "radio":
      return "input"; // with type="radio"
    default:
      return "input";
  }
}
