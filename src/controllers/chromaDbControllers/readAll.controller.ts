import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getAllCollectionData } from "../../utils/vector/collectionService.js";

export const readAllCollection = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const data = await getAllCollectionData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "internel server error" });
    }
  }
);
