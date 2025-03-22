import { openai } from './openAiClient.js';

export const enhanceQuery = async (query: string): Promise<string> => {
  try {
    const prompt = `Expand and refine the following search query for better semantic understanding: "${query}"`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    });

    // Ensure choices exist and message content is not null/undefined
    if (
      !response.choices ||
      response.choices.length === 0 ||
      !response.choices[0].message?.content
    ) {
      throw new Error('OpenAI response is invalid or empty.');
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error in enhanceQuery:', error);
    return query; // Return original query as fallback
  }
};
