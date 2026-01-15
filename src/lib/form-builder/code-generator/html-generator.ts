
import type { FormSchema, FormField, FormSection, ExportConfig } from "../types";
import { generateHtml5Attributes } from "../validation-engine";
import { FIELD_TYPE_CONFIGS } from "../constants";

/**
 * Generate a standard HTML5 form
 */
export function generateHtmlForm(
  schema: FormSchema,
  config: ExportConfig
): string {
  const lines: string[] = [];
  const componentName = config.componentName || "MyForm";

  // HTML Wrapper
  lines.push(`<!DOCTYPE html>`);
  lines.push(`<html lang="en">`);
  lines.push(`<head>`);
  lines.push(`  <meta charset="UTF-8">`);
  lines.push(`  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
  lines.push(`  <title>${schema.name}</title>`);
  
  // Styles
  if (config.styling === "tailwind") {
    lines.push(`  <script src="https://cdn.tailwindcss.com"></script>`);
  } else {
    lines.push(`  <style>`);
    lines.push(`    /* Basic Reset & Styles */`);
    lines.push(`    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }`);
    lines.push(`    .form-group { margin-bottom: 1.5rem; }`);
    lines.push(`    .form-label { display: block; font-weight: 500; margin-bottom: 0.5rem; }`);
    lines.push(`    .form-input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }`);
    lines.push(`    .form-input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }`);
    lines.push(`    .form-error { color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem; }`);
    lines.push(`    .form-required { color: #dc2626; margin-left: 0.25rem; }`);
    lines.push(`    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; font-weight: 500; border-radius: 4px; cursor: pointer; border: none; font-size: 1rem; }`);
    lines.push(`    .btn-primary { background-color: #2563eb; color: white; }`);
    lines.push(`    .btn-primary:hover { background-color: #1d4ed8; }`);
    lines.push(`    .btn-secondary { background-color: #f3f4f6; color: #1f2937; margin-left: 0.5rem; }`);
    lines.push(`    .grid { display: grid; gap: 1rem; }`);
    lines.push(`    .col-span-2 { grid-column: span 2; }`);
    lines.push(`    @media (min-width: 768px) { .grid-cols-2 { grid-template-columns: repeat(2, 1fr); } }`);
    lines.push(`  </style>`);
  }
  lines.push(`</head>`);
  lines.push(`<body>`);
  lines.push("");

  // Form Title
  lines.push(`  <div class="${config.styling === 'tailwind' ? 'max-w-2xl mx-auto' : 'form-container'}">`);
  lines.push(`    <h1 class="${config.styling === 'tailwind' ? 'text-2xl font-bold mb-2' : ''}">${schema.name}</h1>`);
  if (schema.description) {
    lines.push(`    <p class="${config.styling === 'tailwind' ? 'text-gray-600 mb-6' : ''}">${schema.description}</p>`);
  }
  lines.push("");

  // Form Start
  const formClass = config.styling === 'tailwind' ? 'space-y-6' : 'form';
  lines.push(`    <form id="${componentName}" class="${formClass}" novalidate>`);

  // Sections
  const sortedSections = [...schema.sections].sort((a, b) => a.order - b.order);
  for (const section of sortedSections) {
    lines.push(...generateSectionHTML(section, schema.fields, config));
  }

  // Buttons
  lines.push("");
  lines.push(`      <div class="${config.styling === 'tailwind' ? 'flex gap-3 pt-4' : 'form-actions'}">`);
  lines.push(`        <button type="submit" class="${config.styling === 'tailwind' 
    ? 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
    : 'btn btn-primary'}">${schema.settings.submitButtonText}</button>`);
  
  if (schema.settings.resetButtonText) {
    lines.push(`        <button type="reset" class="${config.styling === 'tailwind' 
      ? 'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2' 
      : 'btn btn-secondary'}">${schema.settings.resetButtonText}</button>`);
  }
  lines.push(`      </div>`);
  lines.push(`    </form>`);
  lines.push(`  </div>`);

  // Simple Script for validation
  lines.push("");
  lines.push(`  <script>`);
  lines.push(`    document.getElementById('${componentName}').addEventListener('submit', function(e) {`);
  lines.push(`      e.preventDefault();`);
  lines.push(`      // Basic validation demo`);
  lines.push(`      const formData = new FormData(e.target);`);
  lines.push(`      const data = Object.fromEntries(formData);`);
  lines.push(`      console.log('Form Data:', data);`);
  lines.push(`      alert('Form submitted! Check console for data.');`);
  lines.push(`    });`);
  lines.push(`  </script>`);

  lines.push(`</body>`);
  lines.push(`</html>`);

  return lines.join("\n");
}

function generateSectionHTML(
  section: FormSection,
  allFields: FormField[],
  config: ExportConfig
): string[] {
  const lines: string[] = [];
  const sectionFields = allFields
    .filter((f) => f.sectionId === section.id)
    .sort((a, b) => a.order - b.order);

  if (sectionFields.length === 0) return lines;

  // Grid setup
  let gridClass = '';
  if (config.styling === 'tailwind') {
    if (section.columns === 2) gridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6';
  } else {
    if (section.columns === 2) gridClass = 'grid grid-cols-2';
  }

  if (section.title) {
    const titleClass = config.styling === 'tailwind' ? 'text-lg font-medium text-gray-900 mb-4 pb-2 border-b' : 'section-title';
    lines.push(`      <!-- Section: ${section.title} -->`);
    lines.push(`      <div class="section">`);
    lines.push(`        <h3 class="${titleClass}">${section.title}</h3>`);
  }

  lines.push(`        <div class="${gridClass}">`);

  for (const field of sectionFields) {
    lines.push(...generateFieldHTML(field, config));
  }

  lines.push(`        </div>`);
  
  if (section.title) {
    lines.push(`      </div>`);
  }

  return lines;
}

function generateFieldHTML(field: FormField, config: ExportConfig): string[] {
  const lines: string[] = [];
  const fieldType = FIELD_TYPE_CONFIGS[field.type];
  const isRequired = field.validation?.some(v => v.type === 'required');
  
  // wrapper class
  let wrapperClass = config.styling === 'tailwind' ? 'space-y-1' : 'form-group';
  if (field.colSpan && field.colSpan > 1) {
    wrapperClass += config.styling === 'tailwind' ? ` md:col-span-${field.colSpan}` : ` col-span-${field.colSpan}`;
  }

  lines.push(`          <div class="${wrapperClass}">`);

  // Label
  if (field.label) {
    const labelClass = config.styling === 'tailwind' ? 'block text-sm font-medium text-gray-700' : 'form-label';
    lines.push(`            <label for="${field.name}" class="${labelClass}">`);
    lines.push(`              ${field.label}${isRequired ? `<span class="${config.styling === 'tailwind' ? 'text-red-500 ml-1' : 'form-required'}">*</span>` : ''}`);
    lines.push(`            </label>`);
  }

  // Input
  const inputClass = config.styling === 'tailwind' 
    ? 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
    : 'form-input';
  
  const commonAttrs = `id="${field.name}" name="${field.name}" class="${inputClass}"${field.placeholder ? ` placeholder="${field.placeholder}"` : ''}${isRequired ? ' required' : ''}`;

  if (field.type === 'textarea') {
    lines.push(`            <textarea ${commonAttrs} rows="3"></textarea>`);
  } else if (field.type === 'select') {
    lines.push(`            <select ${commonAttrs}>`);
    lines.push(`              <option value="">${field.placeholder || 'Select...'}</option>`);
    if (field.options) {
      field.options.forEach(opt => {
        lines.push(`              <option value="${opt.value}">${opt.label}</option>`);
      });
    }
    lines.push(`            </select>`);
  } else if (field.type === 'checkbox') {
    lines.push(`            <div class="${config.styling === 'tailwind' ? 'flex items-center' : 'checkbox-group'}">`);
    lines.push(`              <input type="checkbox" id="${field.name}" name="${field.name}" class="${config.styling === 'tailwind' ? 'h-4 w-4 text-blue-600 rounded border-gray-300' : ''}">`);
    lines.push(`              <label for="${field.name}" class="${config.styling === 'tailwind' ? 'ml-2 text-sm text-gray-700' : ''}">${field.label}</label>`);
    lines.push(`            </div>`);
  } else {
    // text, number, email, date, etc.
    const type = fieldType ? fieldType.type : 'text'; // simplified mapping
    lines.push(`            <input type="${type === 'text' || type === 'email' || type === 'number' || type === 'date' ? type : 'text'}" ${commonAttrs}>`);
  }

  // Helper text
  if (field.helperText) {
    const helperClass = config.styling === 'tailwind' ? 'text-sm text-gray-500' : 'form-helper';
    lines.push(`            <p class="${helperClass}">${field.helperText}</p>`);
  }

  lines.push(`          </div>`);
  return lines;
}
