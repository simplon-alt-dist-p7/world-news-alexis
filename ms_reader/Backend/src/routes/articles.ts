import { Router } from "express";
import {
  getLastTenArticlesByMostRecent,
  getArticleById,
} from "../controllers/articles.js";
import validate from "../middlewares/validate.js";
import { getArticleByIdSchema } from "../schemas/articles.schema.js";

const router = Router();

router.get("/", getLastTenArticlesByMostRecent);
router.get("/:id", validate(getArticleByIdSchema, "params"), getArticleById);

export default router;
