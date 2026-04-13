import type { Request, Response } from "express";

export function getRoot(_req: Request, res: Response) {
	res.json({
		message: "Bienvenue sur l'API wm-rajar-ms_reader",
		status: "running",
	});
}

export function getHealth(_req: Request, res: Response) {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
}
