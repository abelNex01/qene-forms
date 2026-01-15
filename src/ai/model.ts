import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model: use.UniversalSentenceEncoder | null = null;
let modelLoadingPromise: Promise<use.UniversalSentenceEncoder> | null = null;

export const loadModel = async (): Promise<use.UniversalSentenceEncoder> => {
  if (model) return model;
  if (modelLoadingPromise) return modelLoadingPromise;

  console.log('[AI Model] Starting model load...');
  
  // Optimize TensorFlow.js backend
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('[AI Model] Using WebGL backend');
  } catch (e) {
    console.warn('[AI Model] WebGL backend failed, falling back to default');
  }

  modelLoadingPromise = use.load({
    modelUrl: undefined, // Use default hosted model
    vocabUrl: undefined, // Use default
  }).then((loadedModel: use.UniversalSentenceEncoder) => {
    model = loadedModel;
    console.log('[AI Model] Universal Sentence Encoder loaded successfully');
    return model;
  }).catch((err) => {
    console.error('[AI Model] Failed to load model:', err);
    modelLoadingPromise = null; // Allow retry
    throw err;
  });

  return modelLoadingPromise;
};

const embeddingCache = new Map<string, number[]>();

export const getEmbeddings = async (texts: string[]): Promise<number[][]> => {
  const model = await loadModel();
  
  // Check cache first
  const uncachedTexts: string[] = [];
  const uncachedIndices: number[] = [];
  const results: number[][] = new Array(texts.length);

  texts.forEach((text, i) => {
    if (embeddingCache.has(text)) {
      results[i] = embeddingCache.get(text)!;
    } else {
      uncachedTexts.push(text);
      uncachedIndices.push(i);
    }
  });

  if (uncachedTexts.length > 0) {
    const tensors = await model.embed(uncachedTexts);
    const data = await tensors.array();
    tensors.dispose(); // Cleanup tensors

    data.forEach((embedding, i) => {
      const originalIndex = uncachedIndices[i];
      const text = uncachedTexts[i];
      results[originalIndex] = embedding;
      embeddingCache.set(text, embedding);
    });
  }

  return results;
};

export const calculateCosineSimilarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
