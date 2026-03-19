import prisma from "../lib/prisma.js";

class ArticlesService {
	async getLastTenByMostRecent() {
		return prisma.article.findMany({
			select: {
				id: true,
				title: true,
				subtitle: true,
				subhead: true,
				publish_date: true,
			},
			where: {
				delete_date: null,
			},
			orderBy: {
				publish_date: "desc",
			},
			take: 10,
		});
	}

	async getById(id: number) {
		return prisma.article.findFirst({
			where: { id, delete_date: null },
		});
	}
}

export default ArticlesService;
