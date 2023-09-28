import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class Experience{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    exp_text: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.experience,{onDelete: 'SET NULL'})
    portfolio: Portfolio;
}