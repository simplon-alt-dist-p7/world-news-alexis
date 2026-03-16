import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../errors/app.error.js";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof AppError) {
		logger.error({
			type: "AppError",
			statusCode: err.statusCode,
			message: err.message,
			url: req.url,
			method: req.method,
		});

		return res.status(err.statusCode).json({ error: err.message });
	}

	logger.error({
		type: "UnhandledError",
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
	});

	return res.status(500).json({ error: "Une erreur interne est survenue" });
};
