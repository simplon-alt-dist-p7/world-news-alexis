import { Router } from "express";
import {
	createArticle,
	getArticle,
	restoreArticle,
	softDeleteArticle,
	updateArticle,
} from "../controllers/article.controller.js";
import { getAllArticles } from "../controllers/article-list.controller.js";
import { searchArticles } from "../controllers/article-search.controller.js";
import { validateId } from "../middlewares/validate-id.middleware.js";

const router = Router();

router.get("/", getAllArticles);
router.post("/", createArticle);
router.get("/search", searchArticles);
router.get("/:id", validateId, getArticle);
router.patch("/:id", validateId, updateArticle);
router.patch("/:id/delete", validateId, softDeleteArticle);
router.patch("/:id/restore", validateId, restoreArticle);

export default router;
