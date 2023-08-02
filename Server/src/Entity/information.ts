import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne}from 'typeorm';
import { Skills } from './skills';
import { User } from './user';
import { Levels } from './levels';
import { Description } from './description';


@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    info_id: string;

    @Column()
    info_text: string;

    @OneToOne(() => Levels)
    @JoinColumn()
    level: Levels;

    @OneToOne(() => Description)
    @JoinColumn()
    description: Description;

    @ManyToMany(() => Skills)
    @JoinTable()
    skill: Skills[]

    @ManyToOne(() => User, (user) => user.informations)
    user: User[];
}
