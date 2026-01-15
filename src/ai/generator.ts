import { getEmbeddings, calculateCosineSimilarity } from './model';
import { FIELD_CONCEPTS, FORM_TEMPLATES, FieldConcept } from './knowledge';

// Simple ID generator to avoid external dependencies in AI module
const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export interface GeneratedField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: any;
}

export const generateFormFromPrompt = async (prompt: string): Promise<GeneratedField[]> => {
  console.log('[AI Generator] Starting generation for:', prompt);
  
  if (!prompt || prompt.length < 3) {
      console.warn('[AI Generator] Prompt too short');
      return [];
  }

  try {
      // 1. Template Matching (Top-Down Approach)
      // Check if the user is asking for a specific *type* of form (e.g. "Registration Form")
      const templateAnchors = FORM_TEMPLATES.map(t => t.keywords[0]);
      const templateEmbeddings = await getEmbeddings(templateAnchors);
      
      const promptEmbedding = (await getEmbeddings([prompt]))[0];
      
      let bestTemplateIndex = -1;
      let maxTemplateSimilarity = -1;

      for (let i = 0; i < templateEmbeddings.length; i++) {
          const similarity = calculateCosineSimilarity(promptEmbedding, templateEmbeddings[i]);
          if (similarity > maxTemplateSimilarity) {
              maxTemplateSimilarity = similarity;
              bestTemplateIndex = i;
          }
      }

      console.log(`[AI Generator] Best template match: ${FORM_TEMPLATES[bestTemplateIndex]?.name} (${maxTemplateSimilarity.toFixed(2)})`);

      // 1.1 Keyword Boosting
      // If embeddings are unsure, check for direct keyword occurrences to boost confidence
      if (maxTemplateSimilarity < 0.6 && bestTemplateIndex !== -1) {
          const matchedTemplate = FORM_TEMPLATES[bestTemplateIndex];
          const hasKeyword = matchedTemplate.keywords.some(k => prompt.toLowerCase().includes(k));
          if (hasKeyword) {
              console.log('[AI Generator] Keyword match found, boosting confidence.');
              maxTemplateSimilarity += 0.2;
          }
      }

      const fields: GeneratedField[] = [];

      // If we have a strong match for a whole form template (> 0.4), use it
      // Threshold lowered slightly and boosted by keywords
      if (maxTemplateSimilarity > 0.4) {
          const template = FORM_TEMPLATES[bestTemplateIndex];
          console.log('[AI Generator] Using template:', template.name);

          // Expand template fields
          for (const fieldId of template.fields) {
              const concept = FIELD_CONCEPTS.find(c => c.id === fieldId);
              if (concept) {
                   // Handle Composite Fields (e.g. Address in a template)
                  if (concept.type === 'composite' && concept.composite) {
                    concept.composite.forEach(subField => {
                        fields.push({
                            id: generateId(),
                            type: subField.type,
                            label: subField.label,
                            placeholder: subField.placeholder || '',
                            required: subField.validation?.required || false,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options: (subField as any).options,
                            validation: subField.validation
                        });
                    });
                  } else {
                    fields.push({
                        id: generateId(),
                        type: concept.type,
                        label: concept.label,
                        placeholder: concept.placeholder || '',
                        required: concept.validation?.required || false,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        options: (concept as any).options,
                        validation: concept.validation
                    });
                  }
              }
          }
          return fields;
      }

      // 2. Bottom-Up Approach (Chunk Parsing)
      // If no template matched, parse specific fields "name, email, and phone"
      console.log('[AI Generator] No template matched, falling back to chunk parsing');

      // ... (chunk parsing remains the same)
      const chunks = prompt
        .toLowerCase()
        .replace('create a form with', '')
        .replace('create a', '')
        .replace('form', '')
        .replace('generate', '')
        .split(/,| and | with | including |\n/)
        .map(s => s.trim())
        .filter(s => s.length > 1);

      if (chunks.length === 0) return [];
      
      const chunkEmbeddings = await getEmbeddings(chunks);
      
      // Match each chunk against concepts
      const validConcepts = FIELD_CONCEPTS.filter(c => c.keywords && c.keywords.length > 0);
      const conceptAnchors = validConcepts.map(c => c.keywords[0]);
      const conceptEmbeddings = await getEmbeddings(conceptAnchors);

      for (let i = 0; i < chunks.length; i++) {
        const chunkEmb = chunkEmbeddings[i];
        let bestMatchIndex = -1;
        let maxSimilarity = -1;

        for (let j = 0; j < conceptEmbeddings.length; j++) {
          const similarity = calculateCosineSimilarity(chunkEmb, conceptEmbeddings[j]);
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            bestMatchIndex = j;
          }
        }
        
        console.log(`[AI Generator] Chunk "${chunks[i]}" best match: ${validConcepts[bestMatchIndex]?.label} (${maxSimilarity.toFixed(2)})`);

        // Low threshold for chunks
        if (maxSimilarity > 0.3) { 
          const concept = validConcepts[bestMatchIndex];
          
          if (concept.type === 'composite' && concept.composite) {
             concept.composite.forEach(subField => {
                fields.push({
                    id: generateId(),
                    type: subField.type,
                    label: subField.label,
                    placeholder: subField.placeholder || '',
                    required: subField.validation?.required || false,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options: (subField as any).options,
                    validation: subField.validation
                });
             });
          } else {
            fields.push({
                id: generateId(),
                type: concept.type,
                label: concept.label, 
                placeholder: concept.placeholder || '',
                required: concept.validation?.required || false,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options: (concept as any).options,
                validation: concept.validation
            });
          }
        } else {
          fields.push({
            id: generateId(),
            type: 'text',
            label: chunks[i].charAt(0).toUpperCase() + chunks[i].slice(1),
            placeholder: '',
            required: false,
          });
        }
      }

      console.log('[AI Generator] Generated fields:', fields);
      return fields;

  } catch (error) {
    console.error('[AI Generator] Error generating form:', error);
    // RESTORED FALLBACK:
    // If AI fails/crashes, assume loose text chunks
    return prompt.split(/,| and | with | including |\n/).filter(s=>s.length>2).map(chunk => ({
        id: generateId(),
        type: 'text',
        label: chunk.trim().charAt(0).toUpperCase() + chunk.trim().slice(1),
        placeholder: '',
        required: false
    }));
  }
};
