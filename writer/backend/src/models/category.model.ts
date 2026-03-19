import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "t_categories", schema: "writer" })
export class Category {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar", length: 50 })
	title!: string;
}
