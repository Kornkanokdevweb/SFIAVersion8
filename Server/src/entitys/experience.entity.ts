import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

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

    @ManyToOne(() => User, (user) => user.experiences)
    user: User;

}