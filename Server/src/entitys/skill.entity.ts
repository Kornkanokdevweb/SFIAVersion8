import { Entity, PrimaryColumn, Column } from "typeorm";

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

    @Column()
    category_id: string;

}