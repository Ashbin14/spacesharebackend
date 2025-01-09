import express from 'express';
import { spaceController } from '../controllers/spaceController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multerconfig.js';

const router = express.Router();

router.post(
  '/spaces',
  authenticate,
  upload.array('images', 5),
  spaceController.createSpace
);

router.get('/spaces', spaceController.getSpaces);
router.get('/spaces/:id', spaceController.getSpaceById);

router.patch(
  '/spaces/:id',
  authenticate,
  upload.array('images', 5),
  spaceController.updateSpace
);

router.delete(
  '/spaces/:id',
  authenticate,
  spaceController.deleteSpace
);