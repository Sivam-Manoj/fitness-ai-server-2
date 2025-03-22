import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';

configDotenv();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Ensure your OpenAI API key is in the .env file
});
