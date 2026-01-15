// Code Generator - Main Entry Point
// Orchestrates the generation of React form components

import type {
  FormSchema,
  ExportConfig,
  GeneratedOutput,
  GeneratedFile,
} from "../types";
import { generateReactComponent, generateReactComponentTS } from "./react-generator";
import { generateTypeDefinitions } from "./typescript-generator";
import { generateStyles, generateTailwindComponent } from "./style-generator";
import { generateReadme } from "./readme-generator";
import { generateHtmlForm } from "./html-generator";

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

/**
 * Generate all output files based on schema and export config
 */
export function generateFormCode(
  schema: FormSchema,
  config: ExportConfig
): GeneratedOutput {
  const dependencies: Record<string, string> = {
    react: "^18.0.0",
  };

  // Generate main component
  let component: GeneratedFile;
  
  if (config.language === "typescript") {
    component = {
      filename: `${config.componentName}.tsx`,
      content: generateReactComponentTS(schema, config),
      type: "tsx",
    };
  } else {
    component = {
      filename: `${config.componentName}.jsx`,
      content: generateReactComponent(schema, config),
      type: "jsx",
    };
  }

  const output: GeneratedOutput = {
    component,
    dependencies,
  };

  // Generate TypeScript types if needed
  if (config.language === "typescript" && config.includeTypes) {
    output.types = {
      filename: `${config.componentName}.types.ts`,
      content: generateTypeDefinitions(schema, config.componentName),
      type: "ts",
    };
  }

  // Generate CSS file if needed
  if (config.styling === "css" && config.includeCssFile) {
    output.styles = {
      filename: `${config.componentName}.css`,
      content: generateStyles(schema, config.componentName),
      type: "css",
    };
  }

  // Generate README
  if (config.includeReadme) {
    output.readme = {
      filename: "README.md",
      content: generateReadme(schema, config, output),
      type: "md",
    };
  }

  // Add validation library dependencies
  if (config.validation === "zod") {
    dependencies["zod"] = "^3.22.0";
  } else if (config.validation === "yup") {
    dependencies["yup"] = "^1.3.0";
  }

  // Add form library dependencies
  if (config.useReactHookForm) {
    dependencies["react-hook-form"] = "^7.48.0";
    if (config.validation === "zod") {
      dependencies["@hookform/resolvers"] = "^3.3.0";
    }
  } else if (config.useFormik) {
    dependencies["formik"] = "^2.4.0";
  }

  return output;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all files as a downloadable zip content structure
 */
export function getFilesForDownload(output: GeneratedOutput): Array<{
  filename: string;
  content: string;
}> {
  const files: Array<{ filename: string; content: string }> = [];

  files.push({
    filename: output.component.filename,
    content: output.component.content,
  });

  if (output.types) {
    files.push({
      filename: output.types.filename,
      content: output.types.content,
    });
  }

  if (output.styles) {
    files.push({
      filename: output.styles.filename,
      content: output.styles.content,
    });
  }

  if (output.readme) {
    files.push({
      filename: output.readme.filename,
      content: output.readme.content,
    });
  }

  // Add package.json snippet
  files.push({
    filename: "dependencies.json",
    content: JSON.stringify({ dependencies: output.dependencies }, null, 2),
  });

  return files;
}

/**
 * Download a single file
 */
export function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Copy content to clipboard
 */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand("copy");
    document.body.removeChild(textarea);
    return result;
  }
}

// Re-export generators for direct access
export { generateReactComponent, generateReactComponentTS } from "./react-generator";
export { generateTypeDefinitions } from "./typescript-generator";
export { generateStyles, generateTailwindComponent } from "./style-generator";
export { generateReadme } from "./readme-generator";
export { generateHtmlForm } from "./html-generator";
