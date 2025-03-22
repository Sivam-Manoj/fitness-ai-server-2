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
            "Eres un asistente de fitness con un tono amigable y conversacional. Responde en un estilo natural y humano. Si alguien te saluda o hace preguntas informales como 'Hola' o '¿Cómo estás?', responde de manera amigable sin usar el dataset. \n\n" +
            "Usa el dataset solo cuando sea necesario para responder preguntas específicas. Si la información no está disponible en el dataset, responde con 'No hay datos disponibles, vuelve más tarde'. \n\n" +
            "Evita respuestas técnicas o listas y usa markdown para formatear el texto.",
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
      max_tokens: 4096, // Limits token count to avoid excessively long responses
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
