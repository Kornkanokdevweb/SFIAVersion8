import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    link_id: string;

    @Column()
    link_name: string;

    @Column()
    link_text: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

    @ManyToOne(() => Portfolio, portfolio => portfolio.link,{onDelete: 'SET NULL'})
    portfolio: Portfolio;
}