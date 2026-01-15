// Conditional Logic Engine
// Evaluates show/hide conditions and generates conditional code

import type {
  FormField,
  ConditionalLogic,
  ConditionalRule,
  ConditionalOperator,
} from "./types";

// ============================================================================
// RUNTIME EVALUATION
// ============================================================================

/**
 * Evaluate if a field should be visible based on its conditional logic
 */
export function evaluateFieldVisibility(
  field: FormField,
  allValues: Record<string, unknown>
): boolean {
  if (!field.conditionalLogic) {
    return true; // No conditional logic = always visible
  }

  const { action, logicType, rules } = field.conditionalLogic;

  if (rules.length === 0) {
    return true;
  }

  const ruleResults = rules.map((rule) => evaluateRule(rule, allValues));

  let conditionMet: boolean;
  if (logicType === "and") {
    conditionMet = ruleResults.every(Boolean);
  } else {
    conditionMet = ruleResults.some(Boolean);
  }

  // If action is "show", field is visible when condition is met
  // If action is "hide", field is visible when condition is NOT met
  return action === "show" ? conditionMet : !conditionMet;
}

/**
 * Evaluate a single conditional rule
 */
function evaluateRule(
  rule: ConditionalRule,
  values: Record<string, unknown>
): boolean {
  const fieldValue = values[rule.fieldId];
  const compareValue = rule.value;

  return evaluateOperator(rule.operator, fieldValue, compareValue);
}

/**
 * Evaluate a comparison operator
 */
function evaluateOperator(
  operator: ConditionalOperator,
  fieldValue: unknown,
  compareValue: unknown
): boolean {
  const stringValue = String(fieldValue ?? "");
  const stringCompare = String(compareValue ?? "");

  switch (operator) {
    case "equals":
      return fieldValue === compareValue || stringValue === stringCompare;

    case "notEquals":
      return fieldValue !== compareValue && stringValue !== stringCompare;

    case "contains":
      return stringValue.includes(stringCompare);

    case "notContains":
      return !stringValue.includes(stringCompare);

    case "isEmpty":
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case "isNotEmpty":
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== "" &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );

    case "greaterThan":
      return Number(fieldValue) > Number(compareValue);

    case "lessThan":
      return Number(fieldValue) < Number(compareValue);

    default:
      return true;
  }
}

/**
 * Get all fields that depend on a given field
 */
export function getDependentFields(
  targetFieldId: string,
  allFields: FormField[]
): FormField[] {
  return allFields.filter((field) => {
    if (!field.conditionalLogic) return false;
    return field.conditionalLogic.rules.some(
      (rule) => rule.fieldId === targetFieldId
    );
  });
}

/**
 * Check if there are any circular dependencies
 */
export function hasCircularDependency(
  fieldId: string,
  conditionalLogic: ConditionalLogic | undefined,
  allFields: FormField[],
  visited: Set<string> = new Set()
): boolean {
  if (!conditionalLogic) return false;
  if (visited.has(fieldId)) return true;

  visited.add(fieldId);

  for (const rule of conditionalLogic.rules) {
    const dependentField = allFields.find((f) => f.id === rule.fieldId);
    if (dependentField) {
      if (
        hasCircularDependency(
          dependentField.id,
          dependentField.conditionalLogic,
          allFields,
          visited
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

// ============================================================================
// CODE GENERATION
// ============================================================================

/**
 * Generate conditional visibility code for a field
 */
export function generateConditionalCode(
  field: FormField,
  fieldNameMap: Map<string, string>
): string {
  if (!field.conditionalLogic) {
    return "true";
  }

  const { action, logicType, rules } = field.conditionalLogic;

  if (rules.length === 0) {
    return "true";
  }

  const conditions = rules.map((rule) => {
    const fieldName = fieldNameMap.get(rule.fieldId) || rule.fieldId;
    return generateRuleCondition(rule, fieldName);
  });

  const joined =
    logicType === "and"
      ? conditions.join(" && ")
      : conditions.join(" || ");

  const expression = rules.length > 1 ? `(${joined})` : joined;

  return action === "show" ? expression : `!(${expression})`;
}

/**
 * Generate condition code for a single rule
 */
function generateRuleCondition(
  rule: ConditionalRule,
  fieldName: string
): string {
  const valueAccess = `values.${fieldName}`;
  const compareValue = JSON.stringify(rule.value);

  switch (rule.operator) {
    case "equals":
      return `${valueAccess} === ${compareValue}`;

    case "notEquals":
      return `${valueAccess} !== ${compareValue}`;

    case "contains":
      return `String(${valueAccess} || '').includes(${compareValue})`;

    case "notContains":
      return `!String(${valueAccess} || '').includes(${compareValue})`;

    case "isEmpty":
      return `(${valueAccess} === undefined || ${valueAccess} === null || ${valueAccess} === '')`;

    case "isNotEmpty":
      return `(${valueAccess} !== undefined && ${valueAccess} !== null && ${valueAccess} !== '')`;

    case "greaterThan":
      return `Number(${valueAccess}) > ${rule.value}`;

    case "lessThan":
      return `Number(${valueAccess}) < ${rule.value}`;

    default:
      return "true";
  }
}

/**
 * Generate a complete visibility hook for React
 */
export function generateVisibilityHook(fields: FormField[]): string {
  const conditionalFields = fields.filter((f) => f.conditionalLogic);

  if (conditionalFields.length === 0) {
    return "";
  }

  // Create field ID to name mapping
  const fieldNameMap = new Map(fields.map((f) => [f.id, f.name]));

  const lines: string[] = [];
  lines.push("/**");
  lines.push(" * Hook to compute field visibility based on form values");
  lines.push(" */");
  lines.push("const useFieldVisibility = (values) => {");
  lines.push("  return {");

  for (const field of conditionalFields) {
    const condition = generateConditionalCode(field, fieldNameMap);
    lines.push(`    ${field.name}: ${condition},`);
  }

  lines.push("  };");
  lines.push("};");

  return lines.join("\n");
}

/**
 * Generate inline visibility check for JSX
 */
export function generateJsxConditional(
  field: FormField,
  fieldNameMap: Map<string, string>,
  jsxContent: string
): string {
  if (!field.conditionalLogic) {
    return jsxContent;
  }

  const condition = generateConditionalCode(field, fieldNameMap);
  return `{${condition} && (\n${jsxContent}\n)}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get human-readable description of a conditional rule
 */
export function describeRule(
  rule: ConditionalRule,
  fieldNameMap: Map<string, string>
): string {
  const fieldName = fieldNameMap.get(rule.fieldId) || "Unknown field";

  switch (rule.operator) {
    case "equals":
      return `${fieldName} equals "${rule.value}"`;
    case "notEquals":
      return `${fieldName} does not equal "${rule.value}"`;
    case "contains":
      return `${fieldName} contains "${rule.value}"`;
    case "notContains":
      return `${fieldName} does not contain "${rule.value}"`;
    case "isEmpty":
      return `${fieldName} is empty`;
    case "isNotEmpty":
      return `${fieldName} is not empty`;
    case "greaterThan":
      return `${fieldName} is greater than ${rule.value}`;
    case "lessThan":
      return `${fieldName} is less than ${rule.value}`;
    default:
      return "Unknown condition";
  }
}

/**
 * Get human-readable description of conditional logic
 */
export function describeConditionalLogic(
  logic: ConditionalLogic,
  fieldNameMap: Map<string, string>
): string {
  if (logic.rules.length === 0) {
    return "Always visible";
  }

  const ruleDescriptions = logic.rules.map((rule) =>
    describeRule(rule, fieldNameMap)
  );

  const connector = logic.logicType === "and" ? " AND " : " OR ";
  const conditions = ruleDescriptions.join(connector);

  return `${logic.action === "show" ? "Show" : "Hide"} when ${conditions}`;
}

// ============================================================================
// OPERATOR CONFIGURATIONS
// ============================================================================

export const OPERATOR_OPTIONS: Array<{
  value: ConditionalOperator;
  label: string;
  requiresValue: boolean;
}> = [
  { value: "equals", label: "Equals", requiresValue: true },
  { value: "notEquals", label: "Does not equal", requiresValue: true },
  { value: "contains", label: "Contains", requiresValue: true },
  { value: "notContains", label: "Does not contain", requiresValue: true },
  { value: "isEmpty", label: "Is empty", requiresValue: false },
  { value: "isNotEmpty", label: "Is not empty", requiresValue: false },
  { value: "greaterThan", label: "Greater than", requiresValue: true },
  { value: "lessThan", label: "Less than", requiresValue: true },
];
