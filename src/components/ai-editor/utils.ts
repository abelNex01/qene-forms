export const generateEmbedding = (text: string) => {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(64).fill(0);
  words.forEach((word, i) => {
    for (let j = 0; j < word.length && j < 64; j++) {
      embedding[j] += word.charCodeAt(j) * (i + 1) * 0.01;
    }
  });
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0)) || 1;
  return embedding.map(v => v / magnitude);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
};

export const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
