import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { extractTextFromPDF } from "../../utils/pdfPharser/pharsePdf.js";
import { splitTextIntoChunks } from "../../utils/text/splitTextIntoChunks.js";
import { upsertEmbedding } from "../../utils/vector/vectorService.js";
import { generateEmbeddings } from "../../utils/openAi/generateEmbeddings .js";

// ✅ Upload PDF and store embeddings with PDF title
export const uploadPDF = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ error: "No file uploaded or file buffer missing." });
      }

      const pdfTitle = req.file.originalname.replace(/\.[^/.]+$/, ""); // Remove file extension

      // ✅ Extract text from the PDF
      const extractedText = await extractTextFromPDF(req.file.buffer);
      if (!extractedText) {
        throw new Error("Failed to extract text from PDF.");
      }

      // ✅ Split extracted text into smaller chunks
      const textChunks = splitTextIntoChunks(extractedText, 100); // Each chunk ~100 characters
      if (!textChunks.length) {
        throw new Error("No valid text chunks extracted from PDF.");
      }

      // ✅ Generate and store embeddings for each chunk
      let storedChunks = 0;
      for (const chunk of textChunks) {
        try {
          const embeddings = await generateEmbeddings(chunk);
          if (!embeddings || embeddings.length === 0) {
            console.warn(
              `⚠️ Skipping empty embedding for chunk: "${chunk.slice(
                0,
                30
              )}..."`
            );
            continue;
          }

          await upsertEmbedding(chunk, { source: pdfTitle, textChunk: chunk });
          storedChunks++;
        } catch (chunkError) {
          throw new Error(`Error processing chunk: ${chunkError}`);
        }
      }

      res.status(200).json({
        message: `✅ PDF processed successfully. Stored embeddings under "${pdfTitle}".`,
        totalChunks: storedChunks,
        skippedChunks: textChunks.length - storedChunks,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error. Failed to process PDF." });
    }
  }
);
