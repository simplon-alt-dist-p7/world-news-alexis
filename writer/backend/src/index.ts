// =============================================================================
// Point d'entrée — Writer Backend
// =============================================================================
//
// Ce fichier se limite à connecter la base de données et démarrer le serveur.
// Toute la configuration Express (middlewares, routes) est dans app.ts.
//
// Cette séparation permet aux tests d'importer app.ts sans démarrer le serveur.
//
// =============================================================================

import app from "./app.js";
import { connectDB } from "./config/database.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			logger.info(`Serveur démarré sur http://localhost:${PORT}`);
		});
	} catch (error) {
		logger.error(`Impossible de démarrer le serveur: ${error}`);
		process.exit(1);
	}
};

startServer();
