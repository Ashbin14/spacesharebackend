import express from 'express';
import { spaceController } from '../controllers/spaceController.js';
import upload from '../config/multerconfig.js'; // Multer config

const router = express.Router();
router.post('/', upload.array('images', 5), spaceController.createSpace);

router.get('/', spaceController.getSpaces);

router.get('/:id', spaceController.getSpaceById);

router.patch('/:id', upload.array('images', 5), spaceController.updateSpace);
router.delete('/:id', spaceController.deleteSpace);

export default router;
