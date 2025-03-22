import multer from 'multer';

// Set up Multer for file uploads with memory storage
const storage = multer.memoryStorage(); // Store the file in memory, which is useful for processing
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit (adjust as needed)
});

// Utility function to handle single file upload
export const uploadPDFSingle = upload.single('pdf'); // 'pdf' should match the form field name
