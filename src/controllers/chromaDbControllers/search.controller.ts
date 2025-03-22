import { Response, Request } from "express";
import expressAsyncHandler from "express-async-handler";
import { aichatStream } from "../chatControllers/chat.openai.js";
import { searchIndex } from "../../utils/vector/vectorService.js";

export const searchVectorIndex = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { search } = req.body;

    if (!search) {
      res.status(400).json({ error: "Search Keyword is required" });
      return;
    }

    try {
      // Step 1: Retrieve relevant data from ChromaDB
      const searchResults = await searchIndex(search);

      // Step 2: Start AI chat with streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      // Call AI chat with streaming
      await aichatStream(search, searchResults, res);
    } catch (error) {
      res.status(500).json({ message: "Error performing search" });
    }
  }
);
