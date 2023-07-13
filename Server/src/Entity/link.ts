import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './Portfolio';

@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.link,{onDelete: 'SET NULL'})
    portfolio: Portfolio[];
}