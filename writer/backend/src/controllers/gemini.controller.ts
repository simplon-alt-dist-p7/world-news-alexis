import type { NextFunction, Request, Response } from "express";
import { geminiService } from "../services/gemini.service.js";

export async function generateTitle(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { body } = req.body as { body: string };

		if (!body) {
			res.status(400).json({
				error: "Le champ 'body' est requis pour générer un titre",
			});
			return;
		}

		const generatedTitle = await geminiService.generateTitle(body);

		res.status(200).json({
			message: "Titre généré avec succès",
			data: generatedTitle,
		});
	} catch (error) {
		next(error);
	}
}

export async function generateSubtitle(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { title, body } = req.body as { title: string; body: string };

		if (!title) {
			res.status(400).json({
				error: "Le champ 'title' est requis pour générer un sous-titre",
			});
			return;
		}

		if (!body) {
			res.status(400).json({
				error: "Le champ 'body' est requis pour générer un sous-titre",
			});
			return;
		}

		const generatedSubtitle = await geminiService.generateSubtitle(title, body);

		res.status(200).json({
			message: "Sous-titre généré avec succès",
			data: generatedSubtitle,
		});
	} catch (error) {
		next(error);
	}
}

export async function generateSubhead(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { body } = req.body as { body: string };

		if (!body) {
			res.status(400).json({
				error: "Le champ 'body' est requis pour générer un chapeau",
			});
			return;
		}

		const generatedSubhead = await geminiService.generateSubhead(body);

		res.status(200).json({
			message: "Chapeau généré avec succès",
			data: generatedSubhead,
		});
	} catch (error) {
		next(error);
	}
}

export async function generateBody(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { body } = req.body as { body: string };

		if (!body) {
			res.status(400).json({
				error: "Le champ 'body' est requis pour être corrigé",
			});
			return;
		}

		const correctedBody = await geminiService.generateBody(body);

		res.status(200).json({
			message: "Body corrigé avec succès",
			data: correctedBody,
		});
	} catch (error) {
		next(error);
	}
}
