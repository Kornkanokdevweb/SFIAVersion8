import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio';

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

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.education,{onDelete: 'SET NULL'})
    portfolio: Portfolio;
}