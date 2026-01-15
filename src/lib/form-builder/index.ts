// Form Builder - Barrel Export
// Re-exports all form builder modules for easy imports

// Types
export * from "./types";

// Constants
export * from "./constants";

// Store
export { useFormBuilderStore } from "./store";
export type { } from "./store";

// Engines
export { FieldRegistry, isTextInput, isSelectionInput, isSpecialInput, getHtmlInputType, getReactComponent } from "./field-registry";
export { validateField, validateForm, generateFieldValidationCode, generateFormValidationCode, generateHtml5Attributes } from "./validation-engine";
export { evaluateFieldVisibility, getDependentFields, hasCircularDependency, generateConditionalCode, generateVisibilityHook, describeConditionalLogic, OPERATOR_OPTIONS } from "./conditional-engine";

// Schema Manager
export {
  validateSchema,
  isSchemaCompatible,
  migrateSchema,
  exportToJSON,
  importFromJSON,
  downloadSchemaAsJSON,
  readSchemaFromFile,
  saveTemplatesToStorage,
  loadTemplatesFromStorage,
  saveRecentSchema,
  getRecentSchemas,
  cloneSchema,
  mergeSchemas,
  getSchemaStats,
  sanitizeSchema,
} from "./schema-manager";

// DnD Manager
export {
  initialDragState,
  startDrag,
  startPaletteDrag,
  startSectionDrag,
  reorderFieldsInSection,
  moveFieldToSection,
  insertFieldAt,
  reorderSections,
  calculateDropZones,
  findClosestDropZone,
  calculateGridPositions,
  findGridDropIndex,
  isValidDrop,
  canDeleteSection,
  getNextOrder,
  normalizeOrders,
} from "./dnd-manager";
export type { DragState, ReorderResult, DropZone } from "./dnd-manager";

// Code Generator
export {
  generateFormCode,
  getFilesForDownload,
  downloadFile,
  copyToClipboard,
  generateReactComponent,
  generateReactComponentTS,
  generateTypeDefinitions,
  generateStyles,
  generateReadme,
  generateHtmlForm,
} from "./code-generator";
