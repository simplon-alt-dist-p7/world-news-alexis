// =============================================================================
// Tests unitaires — Schéma de validation Joi (article)
// =============================================================================
//
// On teste ici NOTRE configuration Joi, pas le framework Joi lui-même.
// Ces règles définissent le contrat de validation du paramètre :id
// sur la route GET /articles/:id.
//
// Pas de base de données, pas de serveur : ce sont des tests unitaires purs.
// =============================================================================
//
// TESTS PARAMÉTRÉS (it.each) :
//
// Les cas d'erreur suivent tous le même pattern : on passe une valeur
// invalide et on vérifie le message d'erreur Joi correspondant.
// Au lieu d'écrire 4 tests quasi-identiques, on factorise avec it.each.
// Chaque ligne du tableau produit un test distinct dans le rapport.
//
// TESTS DE BORNES (boundary testing) :
//
// Le schéma Joi utilise .positive() qui signifie "strictement > 0".
// On teste donc id = 0 (la frontière exacte) en plus de id = -1.
// C'est un cas classique d'off-by-one : positive() rejette 0,
// mais un développeur pourrait confondre avec "non-négatif" (>= 0).
//
// =============================================================================

import { getArticleByIdSchema } from "../schemas/article.schema.js";

describe("Schema getArticleById", () => {
	// ─── Happy path ──────────────────────────────────────────────────────

	it("id entier positif → valide", () => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id: 1 });

		// ASSERT
		expect(error).toBeUndefined();
	});

	// ─── Error paths (paramétrés) ────────────────────────────────────────

	it.each([
		["abc", "L'ID doit être un nombre", "string"],
		[-1, "L'ID doit être positif", "négatif"],
		[0, "L'ID doit être positif", "zéro (borne)"],
		[1.5, "L'ID doit être un entier", "décimal"],
	])("id = %s → erreur '%s' (%s)", (id, expectedMessage, _label) => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id });

		// ASSERT
		expect(error).toBeDefined();
		expect(error?.details[0].message).toBe(expectedMessage);
	});
});
