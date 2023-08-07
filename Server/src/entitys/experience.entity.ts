import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Experience{
    @PrimaryGeneratedColumn()
    exp_id: number;

    @Column('text')
    exp_text: string;

    @Column()
    portfolio_id: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

}