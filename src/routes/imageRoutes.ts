import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadImageToS3 } from '../utils/uploadImageToS3';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided." });
        }

        const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();

        const fileNameWithoutExtension = req.file.originalname.split('.').slice(0, -1).join('.');
        const webpFileName = `${fileNameWithoutExtension}.webp`;

        const webpFile = {
            ...req.file,
            originalname: webpFileName,
            buffer: webpBuffer
        } as Express.Multer.File;

        const url = await uploadImageToS3(webpFile);
        res.json({ message: 'Successfully uploaded image.', url });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
