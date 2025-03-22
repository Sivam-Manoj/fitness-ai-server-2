import { Router } from "express";
import { uploadPDFSingle } from "../../utils/multer/memeryStorageUpload.js";
import { uploadPDF } from "../../controllers/chromaDbControllers/upload.controller.js";
import { searchVectorIndex } from "../../controllers/chromaDbControllers/search.controller.js";
import { deleteCollectionVector } from "../../controllers/chromaDbControllers/delete.controller.js";
import { readAllCollection } from "../../controllers/chromaDbControllers/readAll.controller.js";
import { authMiddleware } from "../../middleware/auth/authMiddleware.js";

const router = Router();
router.post("/upload", authMiddleware, uploadPDFSingle, uploadPDF);
router.post("/chat", authMiddleware, searchVectorIndex);
router.delete("/delete", authMiddleware, deleteCollectionVector);
router.get("/read", authMiddleware, readAllCollection);
export default router;
