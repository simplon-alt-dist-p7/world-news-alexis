// =============================================================================
// Point d'entrée — Reader Backend
// =============================================================================
//
// Ce fichier se limite à démarrer le serveur HTTP.
// Toute la configuration Express (middlewares, routes) est dans app.ts.
//
// Cette séparation permet aux tests d'importer app.ts sans démarrer le serveur.
//
// =============================================================================

import app from "./app.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
	logger.info(`Serveur démarré sur http://localhost:${PORT}`);
});

const shutdown = () => {
	logger.info("Arrêt du serveur...");
	server.close(() => {
		logger.info("Serveur arrêté.");
		process.exit(0);
	});
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
