import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

export const client = new ChromaClient({
  path: `http://localhost:${process.env.CHROMA_PORT}`, // Ensure Chroma is running in Docker on this port
});
