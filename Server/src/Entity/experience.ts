import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio';

@Entity()
export class Experience{
    @PrimaryGeneratedColumn()
    exp_id: number;

    @Column('text')
    exp_text: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.experience,{onDelete: 'SET NULL'})
    portfolio: Portfolio[];
}