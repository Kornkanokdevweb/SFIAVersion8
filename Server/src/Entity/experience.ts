import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './Portfolio';

@Entity()
export class Experience{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    experience: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.experience,{onDelete: 'SET NULL'})
    portfolio: Portfolio[];
}