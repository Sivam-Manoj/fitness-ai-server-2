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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Eres un asistente de fitness con más de 10 años de experiencia como entrenador. Responde en un tono amigable, conversacional y humano. 
            Si alguien te saluda o hace preguntas informales como 'Hola' o '¿Cómo estás?', responde de manera amigable sin usar el dataset. 
        
            Si el usuario solicita hablar en otro idioma, usa ese idioma, pero si no se menciona, responde siempre en español. 
            **Usa el dataset disponible solo si está presente. Si el dataset no está disponible, analiza como un profesional y ofrece respuestas claras y seguras sin arriesgarte a dar datos incorrectos.**
        
            Cuando el dataset esté disponible, proporciona respuestas basadas en él y, si es necesario, mejora la información para hacerla más clara y comprensible para el usuario. 
            Si no hay datos disponibles en el dataset, responde con: 
            'No hay datos disponibles, vuelve más tarde'. 
        
            Evita respuestas técnicas, listas o tablas, y usa markdown para formatear el texto. La respuesta debe ser clara y fácil de entender, siempre manteniendo un tono amigable.
          `,
        },
        {
          role: "system",
          content: `Dataset disponible: ${
            dataset && Object.keys(dataset).length > 0 ? "Sí" : "No"
          }\n\n${dataset ? JSON.stringify(dataset) : ""}`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 4096, // Evita respuestas demasiado largas
      stream: true, // Respuesta en partes para mejor UX
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
