// README Generator
// Generates installation and usage documentation

import type { FormSchema, ExportConfig, GeneratedOutput } from "../types";

/**
 * Generate README documentation for the exported form
 */
export function generateReadme(
  schema: FormSchema,
  config: ExportConfig,
  output: GeneratedOutput
): string {
  const lines: string[] = [];
  const componentName = config.componentName;

  // Title
  lines.push(`# ${componentName}`);
  lines.push("");
  lines.push(`> Generated React form component from "${schema.name}"`);
  lines.push("");

  // Description
  if (schema.description) {
    lines.push(schema.description);
    lines.push("");
  }

  // Table of contents
  lines.push("## Table of Contents");
  lines.push("");
  lines.push("- [Installation](#installation)");
  lines.push("- [Usage](#usage)");
  lines.push("- [Props](#props)");
  lines.push("- [Form Fields](#form-fields)");
  lines.push("- [Validation](#validation)");
  lines.push("- [Customization](#customization)");
  lines.push("");

  // Installation
  lines.push("## Installation");
  lines.push("");
  lines.push("### 1. Install dependencies");
  lines.push("");
  lines.push("```bash");
  lines.push(`npm install ${Object.keys(output.dependencies).join(" ")}`);
  lines.push("```");
  lines.push("");

  lines.push("### 2. Copy the component files");
  lines.push("");
  lines.push("Copy the following files to your project:");
  lines.push("");
  lines.push(`- \`${output.component.filename}\` - Main component`);
  if (output.types) {
    lines.push(`- \`${output.types.filename}\` - TypeScript types`);
  }
  if (output.styles) {
    lines.push(`- \`${output.styles.filename}\` - Styles`);
  }
  lines.push("");

  // Usage
  lines.push("## Usage");
  lines.push("");
  lines.push("### Basic Usage");
  lines.push("");
  lines.push("```" + (config.language === "typescript" ? "tsx" : "jsx"));
  lines.push(`import { ${componentName} } from './${componentName}';`);
  lines.push("");
  lines.push("function App() {");
  lines.push("  const handleSubmit = (values) => {");
  lines.push("    console.log('Form submitted:', values);");
  lines.push("    // Send to API, etc.");
  lines.push("  };");
  lines.push("");
  lines.push("  return (");
  lines.push(`    <${componentName} onSubmit={handleSubmit} />`);
  lines.push("  );");
  lines.push("}");
  lines.push("```");
  lines.push("");

  // With TypeScript
  if (config.language === "typescript") {
    lines.push("### With TypeScript");
    lines.push("");
    lines.push("```tsx");
    lines.push(`import { ${componentName} } from './${componentName}';`);
    lines.push(`import type { ${componentName}Values } from './${componentName}.types';`);
    lines.push("");
    lines.push("function App() {");
    lines.push(`  const handleSubmit = (values: ${componentName}Values) => {`);
    lines.push("    // values is fully typed");
    lines.push("    console.log(values);");
    lines.push("  };");
    lines.push("");
    lines.push("  return (");
    lines.push(`    <${componentName} onSubmit={handleSubmit} />`);
    lines.push("  );");
    lines.push("}");
    lines.push("```");
    lines.push("");
  }

  // Props
  lines.push("## Props");
  lines.push("");
  lines.push("| Prop | Type | Required | Description |");
  lines.push("|------|------|----------|-------------|");
  lines.push(`| \`onSubmit\` | \`(values: ${componentName}Values) => void\` | No | Callback when form is submitted with valid values |`);
  lines.push(`| \`onChange\` | \`(values: ${componentName}Values) => void\` | No | Callback when any field value changes |`);
  lines.push(`| \`initialValues\` | \`Partial<${componentName}Values>\` | No | Initial values to populate the form |`);
  lines.push("| `disabled` | `boolean` | No | Disable all form inputs |");
  lines.push("| `loading` | `boolean` | No | Show loading state |");
  lines.push("");

  // Form Fields
  lines.push("## Form Fields");
  lines.push("");
  lines.push("| Field Name | Type | Label | Required |");
  lines.push("|------------|------|-------|----------|");
  for (const field of schema.fields) {
    const isRequired = field.validation.some((v) => v.type === "required");
    lines.push(`| \`${field.name}\` | ${field.type} | ${field.label} | ${isRequired ? "Yes" : "No"} |`);
  }
  lines.push("");

  // Validation
  lines.push("## Validation");
  lines.push("");
  
  const fieldsWithValidation = schema.fields.filter((f) => f.validation.length > 0);
  if (fieldsWithValidation.length > 0) {
    lines.push("The form includes the following validation rules:");
    lines.push("");
    for (const field of fieldsWithValidation) {
      lines.push(`### ${field.label} (\`${field.name}\`)`);
      lines.push("");
      for (const rule of field.validation) {
        switch (rule.type) {
          case "required":
            lines.push(`- **Required**: ${rule.message}`);
            break;
          case "email":
            lines.push(`- **Email format**: ${rule.message}`);
            break;
          case "minLength":
            lines.push(`- **Minimum length**: ${rule.value} characters`);
            break;
          case "maxLength":
            lines.push(`- **Maximum length**: ${rule.value} characters`);
            break;
          case "min":
            lines.push(`- **Minimum value**: ${rule.value}`);
            break;
          case "max":
            lines.push(`- **Maximum value**: ${rule.value}`);
            break;
          case "pattern":
            lines.push(`- **Pattern**: \`${rule.value}\``);
            break;
        }
      }
      lines.push("");
    }
  } else {
    lines.push("This form does not have any validation rules configured.");
    lines.push("");
  }

  // Customization
  lines.push("## Customization");
  lines.push("");

  if (config.styling === "tailwind") {
    lines.push("### Tailwind CSS");
    lines.push("");
    lines.push("This component uses Tailwind CSS classes. You can customize the styling by:");
    lines.push("");
    lines.push("1. Modifying the class names directly in the component");
    lines.push("2. Using Tailwind's `@apply` directive in your CSS");
    lines.push("3. Overriding styles with custom CSS");
    lines.push("");
    lines.push("Make sure you have Tailwind CSS configured in your project:");
    lines.push("");
    lines.push("```bash");
    lines.push("npm install -D tailwindcss postcss autoprefixer");
    lines.push("npx tailwindcss init -p");
    lines.push("```");
  } else if (config.styling === "css") {
    lines.push("### CSS Styling");
    lines.push("");
    lines.push("The component uses CSS classes defined in the accompanying stylesheet.");
    lines.push("You can customize the appearance by modifying the CSS file or overriding");
    lines.push("the styles in your own stylesheet.");
    lines.push("");
    lines.push("Key CSS classes:");
    lines.push("");
    lines.push("- `.form-input` - Input fields");
    lines.push("- `.form-label` - Field labels");
    lines.push("- `.form-error` - Error messages");
    lines.push("- `.form-button` - Buttons");
    lines.push("- `.form-section` - Form sections");
  } else {
    lines.push("### No Styling");
    lines.push("");
    lines.push("This component was generated without styling. You can add your own");
    lines.push("CSS classes to the elements by modifying the component.");
  }
  lines.push("");

  // Schema info
  lines.push("## Form Schema");
  lines.push("");
  lines.push("This form was generated with the following configuration:");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify({
    name: schema.name,
    version: schema.version,
    sections: schema.sections.length,
    fields: schema.fields.length,
    settings: schema.settings,
  }, null, 2));
  lines.push("```");
  lines.push("");

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(`Generated by Form Builder on ${new Date().toLocaleDateString()}`);

  return lines.join("\n");
}

/**
 * Generate a minimal installation snippet
 */
export function generateInstallSnippet(dependencies: Record<string, string>): string {
  const deps = Object.entries(dependencies)
    .map(([name, version]) => `${name}@${version.replace("^", "")}`)
    .join(" ");

  return `npm install ${deps}`;
}

/**
 * Generate import statements for the component
 */
export function generateImportSnippet(
  componentName: string,
  config: ExportConfig
): string {
  const lines: string[] = [];
  const ext = config.language === "typescript" ? "" : "";

  lines.push(`import { ${componentName} } from './${componentName}${ext}';`);

  if (config.includeTypes && config.language === "typescript") {
    lines.push(`import type { ${componentName}Values, ${componentName}Props } from './${componentName}.types';`);
  }

  if (config.styling === "css" && config.includeCssFile) {
    lines.push(`import './${componentName}.css';`);
  }

  return lines.join("\n");
}
