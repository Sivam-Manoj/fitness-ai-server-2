import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { deleteVectorCollection } from "../../utils/vector/collectionService.js";

export const deleteCollectionVector = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      await deleteVectorCollection();
      res.status(200).json({ message: "collection deleted  succesfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "internel server error when deleting collection" });
    }
  }
);
