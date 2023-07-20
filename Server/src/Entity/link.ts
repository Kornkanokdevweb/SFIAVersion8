import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio';

@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    link_id: number;

    @Column()
    link_name: string;

    @Column()
    link_text: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.link,{onDelete: 'SET NULL'})
    portfolio: Portfolio[];
}