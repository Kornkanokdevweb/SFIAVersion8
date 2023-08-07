import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    link_id: number;

    @Column()
    link_name: string;

    @Column()
    link_text: string;

    @Column()
    portfolio_id: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

}