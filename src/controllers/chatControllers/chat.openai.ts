import { fixSpacing } from "../../utils/fixSpacing/fixSpacing.js";
import { openai } from "../../utils/openAi/openAiClient.js";
import { Response } from "express";

// A function to process chat and stream the response
const aichatStream = async (query: string, dataset: any, res: Response) => {
  if (!query) {
    res.write('data: {"error": "Message is required"}\n\n');
    res.end();
    return;
  }
  if (!dataset) {
    res.write('data: {"error": "Dataset is required"}\n\n');
    res.end();
    return;
  }

  try {
    // Enhance the user query before sending to OpenAI

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI fitness assistant. Respond in a friendly, conversational, and human-like tone. If someone greets you or asks casual questions like 'Hi' or 'How are you?', respond in a friendly manner. Do not analyze the dataset for simple greetings. Only refer to the dataset when a specific query requires it, and make sure your response is in a readable, non-technical format (no tables or lists). Always aim to provide clear and easy-to-understand information, and avoid using external knowledge for casual greetings. use markdown for output. the output language should be spanish",
        },
        {
          role: "system",
          content: `Dataset: ${JSON.stringify(dataset)}\nUser Query: ${query}`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7, // Keeps responses creative but not too random
      max_tokens: 500, // Limits token count to avoid excessively long responses
      stream: true, // Enable streaming so the response is sent in parts
    });

    let tempBuffer = "";

    // Process the streaming response in parts
    for await (const chunk of stream) {
      let content = chunk?.choices?.[0]?.delta?.content;
      if (content) {
        tempBuffer += content;
        const words = tempBuffer.split(/\s+/);

        // Send full words as they are received, stream in parts
        if (words.length > 1) {
          const completeWords = words.slice(0, -1).join(" ");
          res.write(`data: ${fixSpacing(completeWords)}\n\n`);
          tempBuffer = words[words.length - 1];
        }
      }
    }

    // Send any remaining content
    if (tempBuffer.trim()) {
      res.write(`data: ${fixSpacing(tempBuffer.trim())}\n\n`);
    }

    // End the stream
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ AI Chat Error:", error);
    res.write('data: {"error": "Internal Server Error"}\n\n');
    res.end();
  }
};

// Enhance the user query before sending it to OpenAI, ensuring casual greetings are handled properly
const enhanceQuery = async (query: string) => {
  // Check if the query is a casual greeting
  const greetings = ["hi", "hello", "hey", "how are you", "howdy"];
  if (greetings.some((greeting) => query.toLowerCase().includes(greeting))) {
    return query; // Return the original query without enhancement for greetings
  }

  // Enhance the query as needed for other types of messages
  return query.trim(); // You can add more logic here for complex queries
};

export { aichatStream };
