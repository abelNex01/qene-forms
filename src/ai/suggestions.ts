import { getEmbeddings, calculateCosineSimilarity } from './model';
import { FIELD_CONCEPTS, FieldConcept } from './knowledge';

export const suggestFieldAttributes = async (label: string): Promise<Partial<FieldConcept> | null> => {
   if (!label || label.length < 2) return null;

   const [labelEmbedding] = await getEmbeddings([label]);
   
   // Anchor optimization: caching this in a real app is crucial
   const conceptAnchors = FIELD_CONCEPTS.map(c => c.keywords[0]);
   const conceptEmbeddings = await getEmbeddings(conceptAnchors);

   let bestMatchIndex = -1;
   let maxSimilarity = -1;

   for (let j = 0; j < conceptEmbeddings.length; j++) {
     const similarity = calculateCosineSimilarity(labelEmbedding, conceptEmbeddings[j]);
     if (similarity > maxSimilarity) {
       maxSimilarity = similarity;
       bestMatchIndex = j;
     }
   }

   if (maxSimilarity > 0.45) {
      const match = FIELD_CONCEPTS[bestMatchIndex];
      return {
          type: match.type,
          placeholder: match.placeholder,
          validation: match.validation
      };
   }

   return null;
};
