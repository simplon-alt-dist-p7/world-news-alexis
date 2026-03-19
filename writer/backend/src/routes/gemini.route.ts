import { Router } from "express";
import {
	generateBody,
	generateSubhead,
	generateSubtitle,
	generateTitle,
} from "../controllers/gemini.controller.js";

const router = Router();

router.post("/generate-titre", generateTitle);
router.post("/generate-sous-titre", generateSubtitle);
router.post("/generate-chapeau", generateSubhead);
router.post("/generate-body", generateBody);

export default router;
