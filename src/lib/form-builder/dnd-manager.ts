// Drag and Drop Manager
// Logic for field reordering and layout management (no UI)

import type { FormField, FormSection, DragItem, DropResult, FieldType } from "./types";

// ============================================================================
// TYPES
// ============================================================================

export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dropTargetIndex: number | null;
  dropTargetSectionId: string | null;
}

export interface ReorderResult {
  fields: FormField[];
  movedFieldId: string;
  fromIndex: number;
  toIndex: number;
  fromSectionId?: string;
  toSectionId?: string;
}

export interface DropZone {
  index: number;
  sectionId?: string;
  type: "before" | "after" | "empty";
}

// ============================================================================
// INITIAL STATE
// ============================================================================

export const initialDragState: DragState = {
  isDragging: false,
  dragItem: null,
  dropTargetIndex: null,
  dropTargetSectionId: null,
};

// ============================================================================
// DRAG STATE MANAGEMENT
// ============================================================================

/**
 * Start dragging a field
 */
export function startDrag(
  fieldId: string,
  sourceIndex: number,
  sourceSectionId?: string
): DragItem {
  return {
    type: "field",
    id: fieldId,
    sourceIndex,
    sourceSectionId,
  };
}

/**
 * Start dragging a new field from palette
 */
export function startPaletteDrag(fieldType: FieldType): DragItem {
  return {
    type: "palette-field",
    id: `new-${fieldType}-${Date.now()}`,
    fieldType,
  };
}

/**
 * Start dragging a section
 */
export function startSectionDrag(
  sectionId: string,
  sourceIndex: number
): DragItem {
  return {
    type: "section",
    id: sectionId,
    sourceIndex,
  };
}

// ============================================================================
// REORDERING LOGIC
// ============================================================================

/**
 * Reorder fields within a section
 */
export function reorderFieldsInSection(
  fields: FormField[],
  sectionId: string | undefined,
  startIndex: number,
  endIndex: number
): FormField[] {
  // Get fields in the section
  const sectionFields = fields
    .filter((f) => f.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);

  const otherFields = fields.filter((f) => f.sectionId !== sectionId);

  // Perform the reorder
  const reordered = [...sectionFields];
  const [removed] = reordered.splice(startIndex, 1);
  reordered.splice(endIndex, 0, removed);

  // Update orders
  const updatedSectionFields = reordered.map((f, i) => ({
    ...f,
    order: i,
  }));

  return [...otherFields, ...updatedSectionFields];
}

/**
 * Move a field to a different section
 */
export function moveFieldToSection(
  fields: FormField[],
  fieldId: string,
  targetSectionId: string,
  targetIndex: number
): FormField[] {
  const field = fields.find((f) => f.id === fieldId);
  if (!field) return fields;

  const originalSectionId = field.sectionId;

  // Remove from original section and update orders
  let updatedFields = fields.map((f) => {
    if (f.id === fieldId) {
      return f; // Will be updated separately
    }
    if (
      f.sectionId === originalSectionId &&
      f.order > field.order
    ) {
      return { ...f, order: f.order - 1 };
    }
    return f;
  });

  // Make room in target section
  updatedFields = updatedFields.map((f) => {
    if (f.id === fieldId) {
      return f; // Will be updated separately
    }
    if (f.sectionId === targetSectionId && f.order >= targetIndex) {
      return { ...f, order: f.order + 1 };
    }
    return f;
  });

  // Update the moved field
  updatedFields = updatedFields.map((f) => {
    if (f.id === fieldId) {
      return {
        ...f,
        sectionId: targetSectionId,
        order: targetIndex,
      };
    }
    return f;
  });

  return updatedFields;
}

/**
 * Insert a new field at a specific position
 */
export function insertFieldAt(
  fields: FormField[],
  newField: FormField,
  sectionId: string | undefined,
  index: number
): FormField[] {
  // Make room for the new field
  const updatedFields = fields.map((f) => {
    if (f.sectionId === sectionId && f.order >= index) {
      return { ...f, order: f.order + 1 };
    }
    return f;
  });

  // Add the new field
  const fieldWithPosition = {
    ...newField,
    sectionId,
    order: index,
  };

  return [...updatedFields, fieldWithPosition];
}

/**
 * Reorder sections
 */
export function reorderSections(
  sections: FormSection[],
  startIndex: number,
  endIndex: number
): FormSection[] {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const [removed] = sorted.splice(startIndex, 1);
  sorted.splice(endIndex, 0, removed);

  return sorted.map((s, i) => ({ ...s, order: i }));
}

// ============================================================================
// DROP ZONE CALCULATIONS
// ============================================================================

/**
 * Calculate drop zones for a section
 */
export function calculateDropZones(
  fields: FormField[],
  sectionId: string | undefined,
  containerHeight: number
): DropZone[] {
  const sectionFields = fields
    .filter((f) => f.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);

  if (sectionFields.length === 0) {
    return [{ index: 0, sectionId, type: "empty" }];
  }

  const zones: DropZone[] = [];

  // Zone before first field
  zones.push({ index: 0, sectionId, type: "before" });

  // Zone after each field
  sectionFields.forEach((_, i) => {
    zones.push({ index: i + 1, sectionId, type: "after" });
  });

  return zones;
}

/**
 * Find the closest drop zone based on Y position
 */
export function findClosestDropZone(
  y: number,
  zones: Array<{ index: number; y: number; sectionId?: string }>
): DropZone | null {
  if (zones.length === 0) return null;

  let closest = zones[0];
  let minDistance = Math.abs(y - zones[0].y);

  for (const zone of zones) {
    const distance = Math.abs(y - zone.y);
    if (distance < minDistance) {
      minDistance = distance;
      closest = zone;
    }
  }

  return {
    index: closest.index,
    sectionId: closest.sectionId,
    type: closest.index === 0 ? "before" : "after",
  };
}

// ============================================================================
// GRID LAYOUT CALCULATIONS
// ============================================================================

export interface GridPosition {
  row: number;
  column: number;
  colSpan: number;
}

/**
 * Calculate grid positions for fields in a section
 */
export function calculateGridPositions(
  fields: FormField[],
  columns: number
): Map<string, GridPosition> {
  const positions = new Map<string, GridPosition>();
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  let currentRow = 0;
  let currentColumn = 0;

  for (const field of sortedFields) {
    const colSpan = Math.min(field.colSpan || 1, columns);

    // Check if field fits in current row
    if (currentColumn + colSpan > columns) {
      currentRow++;
      currentColumn = 0;
    }

    positions.set(field.id, {
      row: currentRow,
      column: currentColumn,
      colSpan,
    });

    currentColumn += colSpan;
  }

  return positions;
}

/**
 * Find the best drop index based on grid position
 */
export function findGridDropIndex(
  x: number,
  y: number,
  positions: Map<string, GridPosition>,
  cellWidth: number,
  cellHeight: number,
  columns: number
): number {
  const row = Math.floor(y / cellHeight);
  const col = Math.floor(x / cellWidth);

  // Find field at this position
  const entries = Array.from(positions.entries());
  for (let i = 0; i < entries.length; i++) {
    const [, pos] = entries[i];
    if (
      pos.row === row &&
      col >= pos.column &&
      col < pos.column + pos.colSpan
    ) {
      // Drop before or after this field based on X position
      const fieldMidX = (pos.column + pos.colSpan / 2) * cellWidth;
      return x < fieldMidX ? pos.row * columns + pos.column : pos.row * columns + pos.column + 1;
    }
  }

  // No field at position, drop at end
  return positions.size;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Check if a drop is valid
 */
export function isValidDrop(
  dragItem: DragItem,
  dropTarget: DropZone,
  fields: FormField[]
): boolean {
  // Can't drop on itself
  if (
    dragItem.type === "field" &&
    dragItem.sourceSectionId === dropTarget.sectionId &&
    (dragItem.sourceIndex === dropTarget.index ||
      dragItem.sourceIndex === dropTarget.index - 1)
  ) {
    return false;
  }

  return true;
}

/**
 * Check if a section can be deleted (has no dependent conditional logic)
 */
export function canDeleteSection(
  sectionId: string,
  fields: FormField[]
): { canDelete: boolean; reason?: string } {
  const sectionFields = fields.filter((f) => f.sectionId === sectionId);

  if (sectionFields.length === 0) {
    return { canDelete: true };
  }

  // Check if any other field depends on fields in this section
  const sectionFieldIds = new Set(sectionFields.map((f) => f.id));
  const otherFields = fields.filter((f) => f.sectionId !== sectionId);

  for (const field of otherFields) {
    if (!field.conditionalLogic) continue;

    for (const rule of field.conditionalLogic.rules) {
      if (sectionFieldIds.has(rule.fieldId)) {
        return {
          canDelete: false,
          reason: `Field "${field.label}" has conditional logic depending on a field in this section`,
        };
      }
    }
  }

  return { canDelete: true };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique order value for a new field
 */
export function getNextOrder(
  fields: FormField[],
  sectionId?: string
): number {
  const sectionFields = fields.filter((f) => f.sectionId === sectionId);
  if (sectionFields.length === 0) return 0;
  return Math.max(...sectionFields.map((f) => f.order)) + 1;
}

/**
 * Normalize field orders (remove gaps)
 */
export function normalizeOrders(fields: FormField[]): FormField[] {
  const bySection = new Map<string | undefined, FormField[]>();

  for (const field of fields) {
    const key = field.sectionId;
    if (!bySection.has(key)) {
      bySection.set(key, []);
    }
    bySection.get(key)!.push(field);
  }

  const normalized: FormField[] = [];

  Array.from(bySection.values()).forEach((sectionFields) => {
    const sorted = [...sectionFields].sort((a, b) => a.order - b.order);
    sorted.forEach((f, i) => {
      normalized.push({ ...f, order: i });
    });
  });

  return normalized;
}
