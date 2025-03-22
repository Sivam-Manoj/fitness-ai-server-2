import { generateEmbeddings } from "../openAi/generateEmbeddings .js";
import { createCollection } from "./collectionService.js";

// ✅ Insert a new vector into the collection
export const upsertEmbedding = async (
  text: string,
  metadata: Record<string, any>
) => {
  try {
    const vector = await generateEmbeddings(text);
    const collection = await createCollection();

    await collection.upsert({
      documents: [text],
      embeddings: [vector],
      ids: [text.substring(0, 10)], // Unique ID (first 10 chars of text)
      metadatas: [metadata],
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Vector added to ChromaDB.");
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ Error upserting vector:", error);
    }
  }
};

// ✅ Perform a vector search
export const searchIndex = async (queryText: string) => {
  try {
    const queryVector = await generateEmbeddings(queryText);
    const collection = await createCollection();

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: 10,
    });

    return results.documents || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ Error searching ChromaDB:", error);
    }
    return [];
  }
};
