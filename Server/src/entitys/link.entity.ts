import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    link_id: number;

    @Column()
    link_name: string;

    @Column()
    link_text: string;

    @ManyToOne(() => User, (user) => user.links)
    user: User;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

}