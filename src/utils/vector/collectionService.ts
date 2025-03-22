import { client } from "./chromaDbClient.js";

// ✅ Create or get the collection
export const createCollection = async () => {
  try {
    const collection = await client.getOrCreateCollection({ name: "Fitness" });
    return collection;
  } catch (error) {
    throw new Error(`Error creating collection`);
  }
};

// ✅ Get all data from the collection
export const getAllCollectionData = async () => {
  try {
    const collection = await createCollection();
    const allData = await collection.get();
    return allData;
  } catch (error) {
    console.error("❌ Error fetching collection data:", error);
    return null;
  }
};

// ✅ Delete the collection
export const deleteVectorCollection = async () => {
  try {
    await client.deleteCollection({ name: "Fitness" });
  } catch (error) {
    throw new Error(`Error deleting collection`);
  }
};
