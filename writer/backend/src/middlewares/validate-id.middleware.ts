import type { NextFunction, Request, Response } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
	const id = Number.parseInt(req.params.id as string, 10);

	if (Number.isNaN(id) || id <= 0) {
		res.status(400).json({ error: "ID d'article invalide" });
		return;
	}

	next();
};
