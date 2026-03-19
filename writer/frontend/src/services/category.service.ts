import { api } from "../api/api";
import type { Category } from "../types/article.types";

export const categoryService = {
	getAllCategories: async (): Promise<Category[]> => {
		return api.get<Category[]>("/categories");
	},
};
