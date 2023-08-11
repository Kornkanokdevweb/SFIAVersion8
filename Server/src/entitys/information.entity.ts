import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne}from 'typeorm';
import { Skills } from './skills.entity';
import { User } from './user.entity';
import { Levels } from './levels.entity';
import { Description } from './description.entity';


@Entity()
export class Information{
    @PrimaryGeneratedColumn()
    id: string;

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
    skill: Skills[];

    @ManyToOne(() => User, (user) => user.informations)
    user: User;
}