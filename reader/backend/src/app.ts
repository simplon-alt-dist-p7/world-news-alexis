import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import articlesRoutes from "./routes/article.route.js";
import healthRoutes from "./routes/health.route.js";

const app = express();

app.use(helmet());

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET"],
	}),
);

app.use(healthRoutes);
app.use("/articles", articlesRoutes);

app.use((_req, res) => {
	res.status(404).json({ error: "Route non trouvée" });
});

app.use(errorHandler);

export default app;
