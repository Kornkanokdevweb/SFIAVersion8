import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Category } from "./category.entity";
import { Levels } from "./levels.entity";

@Entity()
export class Skills {
    @PrimaryColumn()
    codeskill: string;

    @Column()
    skill_name: string;

    @Column('text')
    overall: string;

    @Column('text')
    note: string;

    @ManyToOne(() => Category, (category) => category.skill)
    category: Category;

    @OneToMany(() => Levels, (level) => level.skill)
    levels: Levels[];

}