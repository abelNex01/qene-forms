// Style Generator
// Generates CSS styles for forms

import type { FormSchema, ExportConfig } from "../types";

/**
 * Generate CSS stylesheet for a form
 */
export function generateStyles(
  schema: FormSchema,
  componentName: string
): string {
  const prefix = componentName.toLowerCase();
  const lines: string[] = [];

  // Header
  lines.push(`/**`);
  lines.push(` * Styles for ${componentName}`);
  lines.push(` * Generated from form schema: ${schema.name}`);
  lines.push(` */`);
  lines.push("");

  // Form container
  lines.push(`.${prefix}-form {`);
  lines.push("  display: flex;");
  lines.push("  flex-direction: column;");
  lines.push("  gap: 1.5rem;");
  lines.push("  max-width: 600px;");
  lines.push("  margin: 0 auto;");
  lines.push("  padding: 1.5rem;");
  lines.push("}");
  lines.push("");

  // Section
  lines.push(".form-section {");
  lines.push("  border: 1px solid #e5e7eb;");
  lines.push("  border-radius: 0.5rem;");
  lines.push("  padding: 1rem;");
  lines.push("  margin: 0;");
  lines.push("}");
  lines.push("");

  lines.push(".form-section-title {");
  lines.push("  font-size: 1.125rem;");
  lines.push("  font-weight: 600;");
  lines.push("  color: #111827;");
  lines.push("  margin-bottom: 0.5rem;");
  lines.push("}");
  lines.push("");

  lines.push(".form-section-desc {");
  lines.push("  font-size: 0.875rem;");
  lines.push("  color: #6b7280;");
  lines.push("  margin-bottom: 1rem;");
  lines.push("}");
  lines.push("");

  // Grid layouts
  for (let cols = 1; cols <= 4; cols++) {
    lines.push(`.form-grid-${cols} {`);
    lines.push("  display: grid;");
    lines.push(`  grid-template-columns: repeat(${cols}, 1fr);`);
    lines.push("  gap: 1rem;");
    lines.push("}");
    lines.push("");
  }

  // Column spans
  for (let span = 2; span <= 4; span++) {
    lines.push(`.col-span-${span} {`);
    lines.push(`  grid-column: span ${span};`);
    lines.push("}");
    lines.push("");
  }

  // Responsive grid
  lines.push("@media (max-width: 768px) {");
  lines.push("  .form-grid-2,");
  lines.push("  .form-grid-3,");
  lines.push("  .form-grid-4 {");
  lines.push("    grid-template-columns: 1fr;");
  lines.push("  }");
  lines.push("");
  lines.push("  .col-span-2,");
  lines.push("  .col-span-3,");
  lines.push("  .col-span-4 {");
  lines.push("    grid-column: span 1;");
  lines.push("  }");
  lines.push("}");
  lines.push("");

  // Field wrapper
  lines.push(".form-field {");
  lines.push("  display: flex;");
  lines.push("  flex-direction: column;");
  lines.push("  gap: 0.25rem;");
  lines.push("}");
  lines.push("");

  // Label
  lines.push(".form-label {");
  lines.push("  display: block;");
  lines.push("  font-size: 0.875rem;");
  lines.push("  font-weight: 500;");
  lines.push("  color: #374151;");
  lines.push("}");
  lines.push("");

  lines.push(".form-required {");
  lines.push("  color: #ef4444;");
  lines.push("  margin-left: 0.25rem;");
  lines.push("}");
  lines.push("");

  // Input styles
  lines.push(".form-input {");
  lines.push("  width: 100%;");
  lines.push("  padding: 0.5rem 0.75rem;");
  lines.push("  border: 1px solid #d1d5db;");
  lines.push("  border-radius: 0.375rem;");
  lines.push("  font-size: 1rem;");
  lines.push("  line-height: 1.5;");
  lines.push("  color: #111827;");
  lines.push("  background-color: #ffffff;");
  lines.push("  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;");
  lines.push("}");
  lines.push("");

  lines.push(".form-input:focus {");
  lines.push("  outline: none;");
  lines.push("  border-color: #3b82f6;");
  lines.push("  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);");
  lines.push("}");
  lines.push("");

  lines.push(".form-input:disabled {");
  lines.push("  background-color: #f3f4f6;");
  lines.push("  cursor: not-allowed;");
  lines.push("}");
  lines.push("");

  lines.push(".form-input::placeholder {");
  lines.push("  color: #9ca3af;");
  lines.push("}");
  lines.push("");

  // Textarea
  lines.push("textarea.form-input {");
  lines.push("  min-height: 100px;");
  lines.push("  resize: vertical;");
  lines.push("}");
  lines.push("");

  // Select
  lines.push("select.form-input {");
  lines.push("  appearance: none;");
  lines.push("  background-image: url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\");");
  lines.push("  background-repeat: no-repeat;");
  lines.push("  background-position: right 0.5rem center;");
  lines.push("  background-size: 1.5em 1.5em;");
  lines.push("  padding-right: 2.5rem;");
  lines.push("}");
  lines.push("");

  // Radio and Checkbox
  lines.push(".form-radio-label {");
  lines.push("  display: flex;");
  lines.push("  align-items: center;");
  lines.push("  gap: 0.5rem;");
  lines.push("  cursor: pointer;");
  lines.push("  font-size: 0.875rem;");
  lines.push("}");
  lines.push("");

  lines.push(".form-radio-input {");
  lines.push("  width: 1rem;");
  lines.push("  height: 1rem;");
  lines.push("  accent-color: #3b82f6;");
  lines.push("}");
  lines.push("");

  // Helper text
  lines.push(".form-helper {");
  lines.push("  font-size: 0.75rem;");
  lines.push("  color: #6b7280;");
  lines.push("}");
  lines.push("");

  // Error message
  lines.push(".form-error {");
  lines.push("  font-size: 0.75rem;");
  lines.push("  color: #ef4444;");
  lines.push("}");
  lines.push("");

  // Input error state
  lines.push(".form-input.error {");
  lines.push("  border-color: #ef4444;");
  lines.push("}");
  lines.push("");

  lines.push(".form-input.error:focus {");
  lines.push("  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);");
  lines.push("}");
  lines.push("");

  // Buttons container
  lines.push(".form-buttons {");
  lines.push("  display: flex;");
  lines.push("  gap: 0.75rem;");
  lines.push("  padding-top: 1rem;");
  lines.push("}");
  lines.push("");

  // Button base
  lines.push(".form-button {");
  lines.push("  padding: 0.5rem 1rem;");
  lines.push("  font-size: 0.875rem;");
  lines.push("  font-weight: 500;");
  lines.push("  border-radius: 0.375rem;");
  lines.push("  cursor: pointer;");
  lines.push("  transition: all 0.15s ease-in-out;");
  lines.push("  border: none;");
  lines.push("}");
  lines.push("");

  lines.push(".form-button:disabled {");
  lines.push("  opacity: 0.5;");
  lines.push("  cursor: not-allowed;");
  lines.push("}");
  lines.push("");

  // Submit button
  lines.push(".form-button-submit {");
  lines.push("  background-color: #3b82f6;");
  lines.push("  color: #ffffff;");
  lines.push("}");
  lines.push("");

  lines.push(".form-button-submit:hover:not(:disabled) {");
  lines.push("  background-color: #2563eb;");
  lines.push("}");
  lines.push("");

  lines.push(".form-button-submit:focus {");
  lines.push("  outline: none;");
  lines.push("  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);");
  lines.push("}");
  lines.push("");

  // Reset button
  lines.push(".form-button-reset {");
  lines.push("  background-color: #e5e7eb;");
  lines.push("  color: #374151;");
  lines.push("}");
  lines.push("");

  lines.push(".form-button-reset:hover:not(:disabled) {");
  lines.push("  background-color: #d1d5db;");
  lines.push("}");
  lines.push("");

  lines.push(".form-button-reset:focus {");
  lines.push("  outline: none;");
  lines.push("  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.3);");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate a component with inline Tailwind classes
 * (Alternative to the react-generator when user wants inline TW)
 */
export function generateTailwindComponent(
  schema: FormSchema,
  config: ExportConfig
): string {
  // This is handled by react-generator with config.styling === "tailwind"
  // Just re-export for convenience
  return "";
}

/**
 * Generate CSS custom properties (CSS variables) version
 */
export function generateCssVariables(): string {
  const lines: string[] = [];

  lines.push(":root {");
  lines.push("  /* Colors */");
  lines.push("  --form-color-primary: #3b82f6;");
  lines.push("  --form-color-primary-hover: #2563eb;");
  lines.push("  --form-color-error: #ef4444;");
  lines.push("  --form-color-text: #111827;");
  lines.push("  --form-color-text-muted: #6b7280;");
  lines.push("  --form-color-border: #d1d5db;");
  lines.push("  --form-color-background: #ffffff;");
  lines.push("  --form-color-background-disabled: #f3f4f6;");
  lines.push("");
  lines.push("  /* Spacing */");
  lines.push("  --form-spacing-xs: 0.25rem;");
  lines.push("  --form-spacing-sm: 0.5rem;");
  lines.push("  --form-spacing-md: 1rem;");
  lines.push("  --form-spacing-lg: 1.5rem;");
  lines.push("");
  lines.push("  /* Typography */");
  lines.push("  --form-font-size-xs: 0.75rem;");
  lines.push("  --form-font-size-sm: 0.875rem;");
  lines.push("  --form-font-size-base: 1rem;");
  lines.push("  --form-font-size-lg: 1.125rem;");
  lines.push("");
  lines.push("  /* Borders */");
  lines.push("  --form-border-radius: 0.375rem;");
  lines.push("  --form-border-width: 1px;");
  lines.push("");
  lines.push("  /* Focus ring */");
  lines.push("  --form-focus-ring-color: rgba(59, 130, 246, 0.3);");
  lines.push("  --form-focus-ring-width: 3px;");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate minimal/reset CSS
 */
export function generateMinimalCss(): string {
  return `/* Minimal form styles */
.form-input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-input:focus {
  outline: 2px solid #0066cc;
  outline-offset: 1px;
}

.form-label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
`;
}
