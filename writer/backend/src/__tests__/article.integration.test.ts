// =============================================================================
// Tests d'intégration — Writer API
// =============================================================================
//
// POURQUOI UN SEUL FICHIER DE TESTS ?
//
// On pourrait séparer "tests unitaires du service" et "tests d'intégration
// de l'API". Mais avec une vraie base de données, les tests du service
// traversent DÉJÀ toutes les couches (service → repository → DB).
// Ajouter une couche HTTP par-dessus (supertest) ne coûte quasiment rien
// en temps et teste le chemin COMPLET qu'un utilisateur emprunte :
//
//   Requête HTTP → Express → Middleware → Controller → Service → Repository → DB
//
// Résultat : on évite les doublons entre deux fichiers qui testeraient
// la même chose à des niveaux d'entrée différents.
//
// =============================================================================
//
// SUPERTEST : TESTER UNE API SANS LANCER LE SERVEUR
//
// Supertest prend directement l'objet Express `app` et simule des requêtes
// HTTP sans ouvrir de port réseau. C'est plus rapide et plus fiable que
// de lancer le serveur sur un port et de faire des fetch().
//
// =============================================================================
//
// STRATÉGIE DE TEST : UN TEST PAR PATTERN
//
// On ne teste pas chaque champ × chaque règle de validation. On teste
// chaque PATTERN de validation une seule fois :
//   - Champ manquant  → testé via title (le pattern est le même pour tous)
//   - Champ espaces   → testé via title (trim + vide = même logique partout)
//   - Unicité         → testé via title (seul champ avec contrainte unique)
//
// On ne teste PAS les guards triviaux (parseInt d'un ID, if (!param)),
// ni les variantes du même pattern (longueur max = même if() que vide).
//
// Si un test passe pour title, on peut faire confiance au même if() pour
// subtitle, subhead, etc. Tester chaque champ séparément ne trouverait
// un bug que si on avait copié-collé le if() avec une faute de frappe,
// ce qui n'est pas un scénario réaliste.
//
// EXCEPTION : les tests de bornes (boundary testing) plus bas testent
// CHAQUE champ individuellement. Ce n'est pas une contradiction : ici on
// parle de patterns (champ vide, champ manquant = même if()). Les bornes
// vérifient des VALEURS NUMÉRIQUES en dur (300, 300, 1000) qui sont
// indépendantes d'un champ à l'autre. Un dev qui écrit > 3000 au lieu
// de > 300 pour subtitle ne casse aucun autre test sans borne dédiée.
//
// =============================================================================
//
// CONVENTION DE NOMMAGE : <condition> → <résultat attendu>
//
// Le tuto (05-tests-unitaires/nommage.md) recommande :
//   test_<quoi>_<condition>_<résultat attendu>
//
// En Vitest, le describe() porte déjà le "quoi" (l'endpoint testé),
// donc le it() ne contient que la condition et le résultat attendu :
//
//   describe("POST /api/articles")
//     it("données valides → 201 + article créé")
//     it("titre dupliqué → 400")
//
// À la lecture du rapport de tests, on obtient :
//   POST /api/articles > données valides → 201 + article créé     ✓
//   POST /api/articles > titre dupliqué → 400                     ✓
//
// =============================================================================

import request from "supertest";
import app from "../app.js";
import { buildCreateArticleDTO, uniqueTitle } from "./helpers/factories.js";

describe("Writer API", () => {
	// ─── POST /api/articles ────────────────────────────────────────────────

	describe("POST /api/articles", () => {
		it("données valides → 201 + article créé", async () => {
			const title = uniqueTitle("POST-201");
			const data = buildCreateArticleDTO({ title });

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Article créé avec succès");
			expect(res.body.data.title).toBe(title);
			expect(res.body.data.category).toBeDefined();
		});

		it("champs obligatoires manquants → 400", async () => {
			const res = await request(app).post("/api/articles").send({
				title: "Seulement un titre",
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty("error");
		});

		it("titre composé uniquement d'espaces → 400", async () => {
			const data = buildCreateArticleDTO({ title: "   " });

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(400);
		});

		it("titre dupliqué → 400", async () => {
			const title = uniqueTitle("Doublon");
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));

			const res = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));

			expect(res.status).toBe(400);
		});

		it("espaces autour des champs → données trimées", async () => {
			const baseTitle = uniqueTitle("Trim");
			const data = buildCreateArticleDTO({
				title: `  ${baseTitle}  `,
				body: "  Contenu avec espaces  ",
			});

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(201);
			expect(res.body.data.title).toBe(baseTitle);
			expect(res.body.data.body).toBe("Contenu avec espaces");
		});

		// ─── Tests de bornes — longueur max des champs ─────────────────────
		//
		// TESTS DE BORNES (boundary testing) :
		// On teste la valeur exacte à la frontière d'une règle de validation.
		// Le service fait : if (data.title.length > 300) → erreur.
		// Donc 300 doit passer, 301 doit échouer. C'est là que se cachent
		// les bugs off-by-one (> vs >=, < vs <=).
		//
		// TESTS PARAMÉTRÉS (it.each) :
		// Au lieu d'écrire 3 tests identiques qui ne diffèrent que par le
		// nom du champ et la longueur, on factorise avec un tableau de cas.
		// Vitest exécute le même bloc pour chaque ligne du tableau.
		// %s et %i sont remplacés par les valeurs dans le nom du test.
		//

		it.each([
			["title", 300],
			["subtitle", 300],
			["subhead", 1000],
		])("%s à la limite (%i chars) → 201", async (field, maxLength) => {
			const value = "a".repeat(maxLength);
			const data = buildCreateArticleDTO({
				title: uniqueTitle(`Borne-${field}`),
				[field]: value,
			});

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(201);
		});

		it.each([
			["title", 301],
			["subtitle", 301],
			["subhead", 1001],
		])("%s au-delà de la limite (%i chars) → 400", async (field, overLimit) => {
			const value = "a".repeat(overLimit);
			const data = buildCreateArticleDTO({
				title: uniqueTitle(`Borne-${field}`),
				[field]: value,
			});

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(400);
		});
	});

	// ─── GET /api/articles ─────────────────────────────────────────────────

	describe("GET /api/articles", () => {
		it("articles existants → 200 + structure { articles, pagination }", async () => {
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: uniqueTitle("List-1") }));

			const res = await request(app).get("/api/articles");

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.articles)).toBe(true);
			expect(res.body.articles.length).toBeGreaterThanOrEqual(1);
			expect(res.body.pagination).toEqual(
				expect.objectContaining({
					page: expect.any(Number),
					limit: expect.any(Number),
					total: expect.any(Number),
					totalPages: expect.any(Number),
				}),
			);
		});
	});

	// ─── GET /api/articles/:id ─────────────────────────────────────────────

	describe("GET /api/articles/:id", () => {
		it("article existant → 200 + données complètes", async () => {
			const title = uniqueTitle("GET-200");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;

			const res = await request(app).get(`/api/articles/${articleId}`);

			expect(res.status).toBe(200);
			expect(res.body.data.title).toBe(title);
		});

		it("article inexistant → 404", async () => {
			const res = await request(app).get("/api/articles/99999");

			expect(res.status).toBe(404);
			expect(res.body.error).toBe("Article non trouvé");
		});
	});

	// ─── PATCH /api/articles/:id ───────────────────────────────────────────

	describe("PATCH /api/articles/:id", () => {
		it("titre modifié → 200 + update_date renseigné", async () => {
			const title = uniqueTitle("PATCH-avant");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;
			const newTitle = uniqueTitle("PATCH-après");

			const res = await request(app)
				.patch(`/api/articles/${articleId}`)
				.send({ title: newTitle });

			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Article mis à jour avec succès");
			expect(res.body.data.update_date).not.toBeNull();
		});
	});

	// ─── PATCH /api/articles/:id/delete + restore ──────────────────────────

	describe("PATCH soft-delete et restore", () => {
		it("soft-delete → article exclu des résultats de recherche", async () => {
			const keyword = `SoftDel${Date.now()}`;
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: keyword }));
			const articleId = created.body.data.id;

			await request(app).patch(`/api/articles/${articleId}/delete`);

			const searchRes = await request(app).get(
				`/api/articles/search?q=${keyword}`,
			);
			expect(searchRes.body.length).toBe(0);
		});

		it("restore après soft-delete → 200 + article ré-accessible", async () => {
			const title = uniqueTitle("Restore");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;

			await request(app).patch(`/api/articles/${articleId}/delete`);

			const restoreRes = await request(app).patch(
				`/api/articles/${articleId}/restore`,
			);

			expect(restoreRes.status).toBe(200);
			expect(restoreRes.body.message).toBe("Article restoré avec succès");

			const getRes = await request(app).get(`/api/articles/${articleId}`);
			expect(getRes.status).toBe(200);
			expect(getRes.body.data.title).toBe(title);
		});
	});

	// ─── GET /api/articles/search ──────────────────────────────────────────

	describe("GET /api/articles/search", () => {
		it("mot-clé existant → articles correspondants", async () => {
			const keyword = `Unique${Date.now()}`;
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: keyword }));

			const res = await request(app).get(`/api/articles/search?q=${keyword}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBe(1);
		});
	});
});
