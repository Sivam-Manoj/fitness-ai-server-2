import { openai } from './openAiClient.js';

export const generateEmbeddings = async (text: string): Promise<number[]> => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002', // Model for generating embeddings
      input: text, // The text you want to generate embeddings for
    });

    // Return the embeddings without truncation, as 'text-embedding-ada-002' gives 1536 dimensions by default
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
};
