export interface FormIssue {
    id: string; // associate with a field if specific
    severity: 'warning' | 'info' | 'critical';
    message: string;
    suggestion: string;
}

export const analyzeForm = (fields: any[]): FormIssue[] => {
    const issues: FormIssue[] = [];
    const labelCounts: Record<string, number> = {};
    let requiredCount = 0;

    fields.forEach(f => {
        // Check 1: Duplicate Labels
        const label = f.label?.toLowerCase().trim();
        if (label) {
            labelCounts[label] = (labelCounts[label] || 0) + 1;
        }

        // Check 2: Accessibility
        if (!f.label && !f.placeholder) {
            issues.push({
                id: f.id,
                severity: 'warning',
                message: 'Field has no label or placeholder',
                suggestion: 'Add a descriptive label for screen readers.'
            });
        }

        if (f.required) requiredCount++;
    });

    // Report Duplicates
    Object.entries(labelCounts).forEach(([label, count]) => {
        if (count > 1) {
            issues.push({
                id: 'global',
                severity: 'warning',
                message: `Duplicate field label found: "${label}"`,
                suggestion: 'Ensure all fields have unique labels.'
            });
        }
    });

    // Check 3: Friction (Too many required fields)
    if (fields.length > 3 && requiredCount === fields.length) {
        issues.push({
            id: 'global',
            severity: 'info',
            message: 'All fields are required',
            suggestion: 'Consider marking some fields as optional to improve conversion rates.'
        });
    }

    return issues;
};
