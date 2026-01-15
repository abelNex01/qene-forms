// Schema Manager
// Utilities for managing form schemas, versioning, and templates

import type { FormSchema, FormField, FormSection, FormTemplate } from "./types";
import { FormSchemaValidator } from "./types";
import {
  CURRENT_SCHEMA_VERSION,
  createEmptyFormSchema,
  STORAGE_KEY_TEMPLATES,
  STORAGE_KEY_RECENT,
} from "./constants";

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a form schema structure
 */
export function validateSchema(schema: unknown): ValidationResult {
  const result = FormSchemaValidator.safeParse(schema);

  if (result.success) {
    return { isValid: true, errors: [] };
  }

  const errors = result.error.errors.map(
    (err) => `${err.path.join(".")}: ${err.message}`
  );

  return { isValid: false, errors };
}

/**
 * Check if a schema is compatible with the current version
 */
export function isSchemaCompatible(schema: FormSchema): boolean {
  const [major] = schema.version.split(".");
  const [currentMajor] = CURRENT_SCHEMA_VERSION.split(".");
  return major === currentMajor;
}

// ============================================================================
// SCHEMA VERSIONING & MIGRATION
// ============================================================================

type SchemaMigration = (schema: FormSchema) => FormSchema;

const migrations: Record<string, SchemaMigration> = {
  // Add future migrations here
  // "0.9.0": (schema) => { ... migrate from 0.9.0 to 1.0.0 ... }
};

/**
 * Migrate a schema to the current version
 */
export function migrateSchema(schema: FormSchema): FormSchema {
  let currentSchema = { ...schema };

  // Get migration versions in order
  const migrationVersions = Object.keys(migrations).sort();

  for (const version of migrationVersions) {
    if (compareVersions(currentSchema.version, version) < 0) {
      currentSchema = migrations[version](currentSchema);
    }
  }

  // Update version to current
  currentSchema.version = CURRENT_SCHEMA_VERSION;
  currentSchema.metadata.updatedAt = new Date().toISOString();

  return currentSchema;
}

/**
 * Compare two version strings
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split(".").map(Number);
  const partsB = b.split(".").map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}

// ============================================================================
// JSON IMPORT/EXPORT
// ============================================================================

/**
 * Export schema to JSON string
 */
export function exportToJSON(schema: FormSchema, pretty = true): string {
  return JSON.stringify(schema, null, pretty ? 2 : undefined);
}

/**
 * Import schema from JSON string
 */
export function importFromJSON(json: string): {
  schema: FormSchema | null;
  error: string | null;
} {
  try {
    const parsed = JSON.parse(json);
    const validation = validateSchema(parsed);

    if (!validation.isValid) {
      return {
        schema: null,
        error: `Invalid schema: ${validation.errors.join(", ")}`,
      };
    }

    // Migrate if needed
    let schema = parsed as FormSchema;
    if (!isSchemaCompatible(schema)) {
      schema = migrateSchema(schema);
    }

    return { schema, error: null };
  } catch (e) {
    return {
      schema: null,
      error: `Failed to parse JSON: ${e instanceof Error ? e.message : "Unknown error"}`,
    };
  }
}

/**
 * Download schema as JSON file
 */
export function downloadSchemaAsJSON(
  schema: FormSchema,
  filename?: string
): void {
  const json = exportToJSON(schema);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${schema.name.replace(/\s+/g, "_")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Read schema from uploaded file
 */
export function readSchemaFromFile(
  file: File
): Promise<{ schema: FormSchema | null; error: string | null }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(importFromJSON(content));
    };

    reader.onerror = () => {
      resolve({ schema: null, error: "Failed to read file" });
    };

    reader.readAsText(file);
  });
}

// ============================================================================
// LOCAL STORAGE OPERATIONS
// ============================================================================

/**
 * Save templates to local storage
 */
export function saveTemplatesToStorage(templates: FormTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error("Failed to save templates to storage:", e);
  }
}

/**
 * Load templates from local storage
 */
export function loadTemplatesFromStorage(): FormTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load templates from storage:", e);
  }
  return [];
}

/**
 * Save recent schemas to local storage
 */
export function saveRecentSchema(schema: FormSchema, maxRecent = 10): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RECENT);
    const recent: Array<{ id: string; name: string; updatedAt: string }> = stored
      ? JSON.parse(stored)
      : [];

    // Remove if already exists
    const filtered = recent.filter((r) => r.id !== schema.id);

    // Add to front
    filtered.unshift({
      id: schema.id,
      name: schema.name,
      updatedAt: schema.metadata.updatedAt,
    });

    // Limit size
    const limited = filtered.slice(0, maxRecent);

    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(limited));
  } catch (e) {
    console.error("Failed to save recent schema:", e);
  }
}

/**
 * Get recent schemas list
 */
export function getRecentSchemas(): Array<{
  id: string;
  name: string;
  updatedAt: string;
}> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RECENT);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load recent schemas:", e);
  }
  return [];
}

// ============================================================================
// SCHEMA UTILITIES
// ============================================================================

/**
 * Clone a schema with new ID
 */
export function cloneSchema(
  schema: FormSchema,
  newName?: string
): FormSchema {
  const now = new Date().toISOString();

  const newSchema: FormSchema = {
    ...JSON.parse(JSON.stringify(schema)),
    id: crypto.randomUUID(),
    name: newName || `${schema.name} (Copy)`,
    metadata: {
      ...schema.metadata,
      createdAt: now,
      updatedAt: now,
    },
  };

  // Generate new IDs for sections
  const sectionIdMap = new Map<string, string>();
  newSchema.sections = newSchema.sections.map((section) => {
    const newId = crypto.randomUUID();
    sectionIdMap.set(section.id, newId);
    return { ...section, id: newId };
  });

  // Generate new IDs for fields and update section references
  newSchema.fields = newSchema.fields.map((field) => ({
    ...field,
    id: crypto.randomUUID(),
    name: `${field.name}_${crypto.randomUUID().slice(0, 4)}`,
    sectionId: field.sectionId
      ? sectionIdMap.get(field.sectionId) || field.sectionId
      : undefined,
  }));

  return newSchema;
}

/**
 * Merge two schemas (add fields from source to target)
 */
export function mergeSchemas(
  target: FormSchema,
  source: FormSchema
): FormSchema {
  const now = new Date().toISOString();

  // Clone source sections and fields with new IDs
  const clonedSource = cloneSchema(source);

  // Get max orders
  const maxSectionOrder = Math.max(0, ...target.sections.map((s) => s.order));
  const maxFieldOrder = Math.max(0, ...target.fields.map((f) => f.order));

  // Adjust orders for merged content
  const newSections = clonedSource.sections.map((s, i) => ({
    ...s,
    order: maxSectionOrder + i + 1,
  }));

  const newFields = clonedSource.fields.map((f, i) => ({
    ...f,
    order: maxFieldOrder + i + 1,
  }));

  return {
    ...target,
    sections: [...target.sections, ...newSections],
    fields: [...target.fields, ...newFields],
    metadata: {
      ...target.metadata,
      updatedAt: now,
    },
  };
}

/**
 * Get schema statistics
 */
export function getSchemaStats(schema: FormSchema): {
  fieldCount: number;
  sectionCount: number;
  requiredFieldCount: number;
  conditionalFieldCount: number;
} {
  const requiredFieldCount = schema.fields.filter((f) =>
    f.validation.some((v) => v.type === "required")
  ).length;

  const conditionalFieldCount = schema.fields.filter(
    (f) => f.conditionalLogic && f.conditionalLogic.rules.length > 0
  ).length;

  return {
    fieldCount: schema.fields.length,
    sectionCount: schema.sections.length,
    requiredFieldCount,
    conditionalFieldCount,
  };
}

/**
 * Sanitize schema (remove invalid references, fix orders)
 */
export function sanitizeSchema(schema: FormSchema): FormSchema {
  const validSectionIds = new Set(schema.sections.map((s) => s.id));

  // Fix field section references
  const sanitizedFields = schema.fields.map((field) => {
    if (field.sectionId && !validSectionIds.has(field.sectionId)) {
      return {
        ...field,
        sectionId: schema.sections[0]?.id,
      };
    }
    return field;
  });

  // Fix section orders
  const sortedSections = [...schema.sections].sort((a, b) => a.order - b.order);
  const fixedSections = sortedSections.map((s, i) => ({
    ...s,
    order: i,
  }));

  // Fix field orders within sections
  const fieldsBySection = new Map<string | undefined, FormField[]>();
  for (const field of sanitizedFields) {
    const sectionId = field.sectionId;
    if (!fieldsBySection.has(sectionId)) {
      fieldsBySection.set(sectionId, []);
    }
    fieldsBySection.get(sectionId)!.push(field);
  }

  const fixedFields: FormField[] = [];
  Array.from(fieldsBySection.values()).forEach((fields) => {
    const sorted = [...fields].sort((a, b) => a.order - b.order);
    sorted.forEach((f, i) => {
      fixedFields.push({ ...f, order: i });
    });
  });

  return {
    ...schema,
    sections: fixedSections,
    fields: fixedFields,
    metadata: {
      ...schema.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}
