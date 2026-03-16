// =============================================================================
// Configuration Stryker — Tests de mutation
// =============================================================================
//
// TESTS DE MUTATION : LE PRINCIPE
//
// Stryker modifie automatiquement le code source (les "mutants") et relance
// les tests pour chaque modification. Si les tests passent malgré la mutation,
// c'est un "mutant survivant" — un trou dans la couverture de tests.
//
// Exemples de mutations :
//   .positive()  → supprimé    (le schéma accepte-t-il id = -1 ?)
//   .integer()   → supprimé    (le schéma accepte-t-il id = 1.5 ?)
//   .required()  → supprimé    (le schéma accepte-t-il un id absent ?)
//
// PÉRIMÈTRE LIMITÉ
//
// On cible uniquement le schéma Joi (article.schema.ts) et ses tests.
// C'est un cas idéal pour débuter : tests unitaires purs, rapides,
// et chaque mutation correspond à une règle Joi visible.
//
// =============================================================================

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
	// Fichier source à muter (uniquement le schéma Joi)
	mutate: ["src/schemas/article.schema.ts"],

	// Runner : Vitest (le framework de test du projet)
	testRunner: "vitest",

	// Reporter : "clear-text" affiche les résultats dans le terminal,
	// "html" génère un rapport visuel dans reports/mutation/
	reporters: ["clear-text", "html"],

	// Dossier de sortie pour le rapport HTML
	htmlReporter: {
		fileName: "reports/mutation/index.html",
	},

	// Seuils du score de mutation :
	//   - high (>= 80) : vert dans le rapport
	//   - low  (< 60)  : rouge, il manque des tests
	//   - break (< 50) : Stryker retourne un code d'erreur (échec CI)
	thresholds: {
		high: 80,
		low: 60,
		break: 50,
	},
};
