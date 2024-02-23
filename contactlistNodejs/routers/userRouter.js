import express from 'express'
import { add, deleteUser, getAll, update } from '../controllers/userController.js';

const router = express.Router();

router.post("/", add);
router.get("/", getAll);
router.patch("/:id", update);
router.delete("/:id", deleteUser);

export default router;