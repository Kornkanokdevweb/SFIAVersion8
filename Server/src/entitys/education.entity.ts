import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Education{
    @PrimaryGeneratedColumn()
    education_id: number;

    @Column()
    syear: number;

    @Column()
    eyear: number;

    @Column()
    level_edu: string;

    @Column()
    universe: string;

    @Column()
    faculty: string;

    @Column()
    branch: string;

    @Column()
    portfolio_id: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;
 
}