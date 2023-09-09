import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Education{
    @PrimaryGeneratedColumn()
    education_id: number;

    @Column()
    syear: number;

    @Column()
    eyear: number;

    @Column()
    level_edu: string;

    @Column()
    universe: string;

    @Column()
    faculty: string;

    @Column()
    branch: string;

    @ManyToOne(() => User, (user) => user.educations)
    user: User;

    @CreateDateColumn({
        type: "timestamp"
    })
    date: Date;

}