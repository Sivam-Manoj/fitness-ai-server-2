export const splitTextIntoChunks = (
  text: string,
  chunkSize: number = 500
): string[] => {
  const sentences = text.split('. '); // Split by sentences
  let chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '. ';
    } else {
      currentChunk += sentence + '. ';
    }
  }

  if (currentChunk.length > 0) chunks.push(currentChunk.trim());

  return chunks;
};
